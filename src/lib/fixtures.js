import { rtdb } from './firebase'
import { ref, set, update, get } from 'firebase/database'
import { COMP_IDS, SAMPLE_FIXTURES } from './constants'

export async function fetchAndStoreFixtures(sport, poolId) {
  const compId = COMP_IDS[sport]
  if (!compId) return []
  const season = sport === 'WC' ? '2026' : '2025'
  const url = `/.netlify/functions/fixtures?comp=${compId}&season=${season}`
  try {
    const res = await fetch(url)
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
    const data = JSON.parse(text)
    const matches = (data.matches || []).map(m => ({
      id: 'm' + m.id,
      home: m.homeTeam.shortName || m.homeTeam.name,
      away: m.awayTeam.shortName || m.awayTeam.name,
      kickoff: m.utcDate,
      matchday: m.matchday || 1,
      status: m.status,
      homeScore: m.score?.fullTime?.home ?? null,
      awayScore: m.score?.fullTime?.away ?? null,
    }))
    await set(ref(rtdb, `pools/${poolId}/fixtures`), Object.fromEntries(matches.map(m => [m.id, m])))
    const results = {}
    matches.forEach(m => {
      if (m.status === 'FINISHED' && m.homeScore != null) {
        results[m.id] = { h: m.homeScore, a: m.awayScore }
      }
    })
    if (Object.keys(results).length > 0) {
      await update(ref(rtdb, `pools/${poolId}/results`), results)
    }
    return matches
  } catch (e) {
    console.error('Fixture fetch error:', e)
    throw e
  }
}

export async function loadFixtures(poolId) {
  const snap = await get(ref(rtdb, `pools/${poolId}/fixtures`))
  if (snap.exists()) {
    return Object.values(snap.val()).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
  }
  return []
}
