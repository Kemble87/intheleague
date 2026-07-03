const koFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
const dayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long' })
const dateFmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' })

export function fmtKO(iso) {
  if (!iso) return ''
  const p = koFmt.formatToParts(new Date(iso)).reduce((a, b) => (a[b.type] = b.value, a), {})
  return `${p.weekday} ${p.day} ${p.month} · ${p.hour}:${p.minute}`
}

export function fmtDay(iso) { return dayFmt.format(new Date(iso)) }

export function groupDays(arr) {
  const m = {}, o = []
  ;(arr || []).forEach(f => {
    const d = dateFmt.format(new Date(f.kickoff))
    if (!m[d]) { m[d] = []; o.push(d) }
    m[d].push(f)
  })
  return o.map(d => ({ d, label: fmtDay(new Date(d + 'T12:00:00Z')), items: m[d] }))
}

export function countdown(iso, now) {
  const t = new Date(iso) - now
  if (t <= 0 || t > 172800000) return null
  const h = Math.floor(t / 3.6e6), m = Math.floor((t % 3.6e6) / 6e4)
  return h >= 1 ? `${h}h ${m}m` : `${m}m`
}

export function calcPts(pick, result) {
  if (!pick || !result || pick.h == null || pick.a == null || result.h == null || result.a == null) return null
  if (pick.h === result.h && pick.a === result.a) return 3
  if (Math.sign(pick.h - pick.a) === Math.sign(result.h - result.a)) return 1
  return 0
}

export function initials(s) { return (s || '?').split(/[\s@]/)[0].slice(0, 2).toUpperCase() }
export function abbr(n) { const w = n.split(' '); return w.length > 1 ? w.map(x => x[0]).join('').slice(0, 3).toUpperCase() : n.slice(0, 3).toUpperCase() }
export function slugify(s) { return (s || 'pool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 18) + '-' + Math.random().toString(36).slice(2, 5) }

export async function fetchAndStoreFixtures(sport, poolId, rtdb) {
  const COMP_IDS = { PL: 'PL', CHAMP: 'ELC', L1: 'EL1', WC: 'WC' }
  const compId = COMP_IDS[sport]
  if (!compId) return []
  const season = sport === 'WC' ? '2026' : '2025'
  const url = `/.netlify/functions/fixtures?comp=${compId}&season=${season}`
  try {
    const res = await fetch(url)
    const text = await res.text()
    if (!res.ok) throw new Error('HTTP ' + res.status)
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
    const { ref, set, update } = await import('firebase/database')
    await set(ref(rtdb, 'pools/' + poolId + '/fixtures'), Object.fromEntries(matches.map(m => [m.id, m])))
    const results = {}
    matches.forEach(m => { if (m.status === 'FINISHED' && m.homeScore != null) results[m.id] = { h: m.homeScore, a: m.awayScore } })
    if (Object.keys(results).length > 0) await update(ref(rtdb, 'pools/' + poolId + '/results'), results)
    return matches
  } catch (e) {
    console.error('Fixture fetch error:', e)
    throw e
  }
}

export async function loadFixtures(poolId, rtdb) {
  const { ref, get } = await import('firebase/database')
  const snap = await get(ref(rtdb, 'pools/' + poolId + '/fixtures'))
  if (snap.exists()) return Object.values(snap.val()).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
  return []
}

// ── Chip-aware per-matchday scoring ──────────────────────────────────────────
// Returns { [md]: { scores: { [uid]: pts }, complete: bool } }
export function matchdayScores(fixtures, results, memberIds, allPicks, allChips) {
  const byMd = {}
  ;(fixtures || []).forEach(f => {
    if (f.matchday == null) return
    ;(byMd[f.matchday] = byMd[f.matchday] || []).push(f)
  })
  const out = {}
  Object.entries(byMd).forEach(([md, fxs]) => {
    const complete = fxs.length > 0 && fxs.every(f => results[f.id]?.h != null && results[f.id]?.a != null)
    const scores = {}
    ;(memberIds || []).forEach(uid => {
      const chips = (allChips || {})[uid] || {}
      const copyTarget = chips.copycat?.targetUid
      const copyMd = chips.copycat?.matchday
      const ptsArr = []
      fxs.forEach(f => {
        let pk = (allPicks[uid] || {})[f.id]
        if (copyTarget && String(md) === String(copyMd)) pk = (allPicks[copyTarget] || {})[f.id] || pk
        let p = calcPts(pk, results[f.id])
        if (p != null) {
          let mult = 1
          if (chips['2x']?.matchday && String(chips['2x'].matchday) === String(md)) mult *= 2
          if (chips.banker?.fixtureId === f.id) mult *= 3
          p = p * mult
        }
        ptsArr.push(p)
      })
      if (chips.coupon?.matchday && String(chips.coupon.matchday) === String(md)) {
        let wi = -1, wp = Infinity
        ptsArr.forEach((p, i) => { if (p != null && p < wp) { wp = p; wi = i } })
        if (wi >= 0 && wp < 3) ptsArr[wi] = wp === 0 ? 1 : 3
      }
      scores[uid] = ptsArr.reduce((s, p) => (p != null ? s + p : s), 0)
    })
    out[md] = { scores, complete }
  })
  return out
}
