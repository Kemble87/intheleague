import { useState, useMemo } from 'react'
import { matchdayScores, runInStart } from '../lib/helpers'

const DISP = "'Space Grotesk','Inter',sans-serif"
const MONO = "'Share Tech Mono',ui-monospace,monospace"
const BEBAS = "'Bebas Neue',sans-serif"

const pick = (arr, seed) => arr[seed % arr.length]
const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

export default function Bulletin({ pool, poolId, members, fixtures, results, allPicks, allChips, userId, userPicks }) {
  const [open, setOpen] = useState(false)

  const story = useMemo(() => {
    if ((members || []).length < 2) return null
    const merged = { ...allPicks, [userId]: userPicks }
    const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), merged, allChips)
    const done = Object.entries(mds).filter(([, v]) => v.complete).map(([md, v]) => [Number(md), v]).sort((a, b) => a[0] - b[0])
    if (!done.length) return null

    const [md, { scores }] = done[done.length - 1]
    const seed = hash(poolId + ':' + md)
    const nameOf = uid => ((pool.members?.[uid]?.name) || '?').split(' ')[0]

    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const [wUid, wPts] = ranked[0]
    if (wPts <= 0) return null
    const winner = nameOf(wUid)
    const runnerUp = ranked[1] ? { name: nameOf(ranked[1][0]), pts: ranked[1][1] } : null
    const [sUid, sPts] = ranked[ranked.length - 1]
    const spoon = sUid !== wUid ? { name: nameOf(sUid), pts: sPts } : null

    // Winner's exacts in this matchday
    const mdFx = (fixtures || []).filter(f => String(f.matchday) === String(md))
    const wPicks = merged[wUid] || {}
    const wExacts = mdFx.filter(f => {
      const p = wPicks[f.id], r = results[f.id]
      return p && r && p.h === r.h && p.a === r.a
    }).length

    // Cumulative standings before vs after this matchday
    const totalsUpTo = idx => {
      const t = {}
      done.slice(0, idx).forEach(([, { scores: s2 }]) => Object.entries(s2).forEach(([u, p]) => { t[u] = (t[u] || 0) + p }))
      return Object.entries(t).sort((a, b) => b[1] - a[1])
    }
    const after = totalsUpTo(done.length)
    const before = totalsUpTo(done.length - 1)
    const leaderNow = after[0] ? nameOf(after[0][0]) : null
    const leaderBefore = before[0] ? nameOf(before[0][0]) : null
    const leadChanged = leaderBefore && leaderNow && leaderBefore !== leaderNow
    const gap = after.length > 1 ? after[0][1] - after[1][1] : 0

    // Chips played on this matchday
    const CHIP_NAMES = { '2x': 'the 2× Multiplier', banker: 'the Banker', hth: 'Half Time Hero', copycat: 'Copycat', coupon: 'the Coupon Buster' }
    const chipPlays = []
    Object.entries(allChips || {}).forEach(([uid, chips]) => {
      Object.entries(chips || {}).forEach(([cid, data]) => {
        if (CHIP_NAMES[cid] && String(data?.matchday) === String(md)) {
          chipPlays.push({ who: nameOf(uid), chip: CHIP_NAMES[cid], pts: scores[uid] ?? 0, won: uid === wUid })
        }
      })
    })

    // Next matchday
    const now = Date.now()
    const future = (fixtures || []).filter(f => new Date(f.kickoff).getTime() > now && f.matchday)
    const nextMd = future.length ? Math.min(...future.map(f => Number(f.matchday))) : null
    const riStart = runInStart(fixtures)

    // ── Compose ──
    const headline = pick([
      `${winner.toUpperCase()} TAKES MATCHDAY ${md}`,
      `${winner.toUpperCase()} DELIVERS ON MD${md}`,
      `MATCHDAY ${md} BELONGS TO ${winner.toUpperCase()}`,
      `${wPts} AND DONE: ${winner.toUpperCase()} WINS MD${md}`,
    ], seed)

    const standfirst = leadChanged
      ? `${leaderNow} seizes top spot as the table turns.`
      : gap > 0 && leaderNow
        ? `${leaderNow} stays clear at the summit — ${gap} point${gap !== 1 ? 's' : ''} in hand.`
        : `All square at the top and nothing settled.`

    const paras = []
    paras.push(pick([
      `${winner} claimed the matchday cr
