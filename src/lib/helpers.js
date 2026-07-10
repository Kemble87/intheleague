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
export function abbr(n) { n = n || 'TBD'; const w = String(n).split(' '); return w.length > 1 ? w.map(x => x[0]).join('').slice(0, 3).toUpperCase() : String(n).slice(0, 3).toUpperCase() }
export function slugify(s) { return (s || 'pool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 18) + '-' + Math.random().toString(36).slice(2, 5) }

export async function fetchAndStoreFixtures(sport, poolId, rtdb) {
  const COMP_IDS = { PL: 'PL', CHAMP: 'ELC', L1: 'EL1', WC: 'WC' }
  const compId = COMP_IDS[sport]
  if (!compId) return []
  const season = '2026' // 2026/27 season (and 2026 World Cup)
  const url = `/.netlify/functions/fixtures?comp=${compId}&season=${season}`
  try {
    const res = await fetch(url)
    const text = await res.text()
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const data = JSON.parse(text)
    const STAGE_MD = { LAST_32: 4, LAST_16: 5, QUARTER_FINALS: 6, SEMI_FINALS: 7, THIRD_PLACE: 8, FINAL: 8 }
    const matches = (data.matches || []).map(m => ({
      id: 'm' + m.id,
      home: m.homeTeam?.shortName || m.homeTeam?.name || 'TBD',
      away: m.awayTeam?.shortName || m.awayTeam?.name || 'TBD',
      kickoff: m.utcDate,
      matchday: (m.stage && STAGE_MD[m.stage]) || m.matchday || 1,
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

// ── The Run-In: final 9 matchdays score double, whatever the competition ──
export function runInStart(fixtures) {
  const mds = (fixtures || []).map(f => Number(f.matchday)).filter(n => !isNaN(n) && n > 0)
  if (!mds.length) return Infinity
  return Math.max(...mds) - 8
}
export function runInMult(matchday, fixtures) {
  return Number(matchday) >= runInStart(fixtures) ? 2 : 1
}

export function matchdayScores(fixtures, results, memberIds, allPicks, allChips) {
  const byMd = {}
  ;(fixtures || []).forEach(f => {
    if (f.matchday == null) return
    ;(byMd[f.matchday] = byMd[f.matchday] || []).push(f)
  })
  const riStart = runInStart(fixtures)
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
          let mult = Number(md) >= riStart ? 2 : 1
          if (chips['2x']?.matchday && String(chips['2x'].matchday) === String(md)) mult *= 2
          if (chips.banker?.fixtureId === f.id) mult *= 3
          p = p * mult
        }
        ptsArr.push(p)
      })
      if (chips.coupon?.matchday && String(chips.coupon.matchday) === String(md)) {
        const ri = Number(md) >= riStart ? 2 : 1
        let wi = -1, wp = Infinity
        ptsArr.forEach((p, i) => { if (p != null && p < wp) { wp = p; wi = i } })
        if (wi >= 0 && wp < 3 * ri) ptsArr[wi] = wp === 0 ? 1 * ri : 3 * ri
      }
      scores[uid] = ptsArr.reduce((s, p) => (p != null ? s + p : s), 0)
    })
    out[md] = { scores, complete }
  })
  return out
}
