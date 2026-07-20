// Derives a timestamped event stream for the League Feed from existing pool data.
// No new writes — everything here is computed from fixtures/results/picks/chips.
import { matchdayScores, calcPts, runInStart } from './helpers'

const CHIP_LABELS = {
  '2x': { label: '2× Multiplier', kind: '2×' },
  banker: { label: 'the Banker', kind: '3×' },
  hth: { label: 'Half Time Hero', kind: 'HTH' },
  copycat: { label: 'Copycat', kind: 'COPY' },
  coupon: { label: 'the Coupon Buster', kind: 'COUPON' },
}

const firstName = (members, uid) => {
  const m = members.find(([id]) => id === uid)
  return ((m && m[1].name) || '?').split(' ')[0]
}

// Latest kickoff among a matchday's fixtures = when that matchday "completed"
function matchdayEndTime(fixtures, md) {
  const fx = fixtures.filter(f => String(f.matchday) === String(md))
  if (!fx.length) return 0
  return Math.max(...fx.map(f => new Date(f.kickoff).getTime()))
}

export function buildFeed({ pool, poolId, fixtures, results, allPicks, allChips, members, userId }) {
  if (!fixtures?.length || (members || []).length < 1) return []
  const merged = { ...(allPicks || {}), [userId]: (allPicks || {})[userId] || {} }
  const events = []
  const now = Date.now()

  // ── Next deadline (pinned) ──
  const upcoming = fixtures
    .filter(f => new Date(f.kickoff).getTime() > now && f.matchday)
    .sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
  if (upcoming.length) {
    const next = upcoming[0]
    const md = next.matchday
    const riStart = runInStart(fixtures)
    const isRunIn = Number(md) >= riStart
    events.push({
      type: 'deadline',
      pinned: true,
      ts: new Date(next.kickoff).getTime(),
      kicker: 'PICKS LOCK',
      lockTs: new Date(next.kickoff).getTime(),
      headline: `Matchday ${md} picks`,
      sub: isRunIn ? 'The Run-In — double points. Nobody is safe.' : 'Lock at kickoff — don\'t be the one who forgot.',
    })
  }

  // ── Completed-matchday events: wins, rank swings ──
  const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), merged, allChips || {})
  const doneMd = Object.entries(mds)
    .filter(([, v]) => v.complete)
    .map(([md, v]) => ({ md: Number(md), scores: v.scores }))
    .sort((a, b) => a.md - b.md)

  // Running totals to detect the leader after each matchday
  const totals = {}
  let prevLeader = null
  doneMd.forEach(({ md, scores }) => {
    const endTs = matchdayEndTime(fixtures, md)
    Object.entries(scores).forEach(([uid, p]) => { totals[uid] = (totals[uid] || 0) + p })

    // Matchday winner
    const top = Math.max(...Object.values(scores))
    if (top > 0) {
      const winners = Object.entries(scores).filter(([, p]) => p === top).map(([uid]) => uid)
      const w = winners[0]
      events.push({
        type: 'crown',
        ts: endTs + 1,
        kicker: `MATCHDAY ${md} · CROWNED`,
        headline: winners.length > 1
          ? `${winners.map(u => firstName(members, u)).join(' & ')} share Matchday ${md}`
          : `${firstName(members, w)} takes the crown`,
        sub: `${top} point${top !== 1 ? 's' : ''}${w === userId ? " — that's you." : ''}`,
        gold: true,
      })
    }

    // Exact scores this matchday (one event per exact, capped to keep it tidy)
    const mdFx = fixtures.filter(f => String(f.matchday) === String(md))
    mdFx.forEach(f => {
      const r = results[f.id]
      if (!r || r.h == null) return
      Object.keys(merged).forEach(uid => {
        const p = (merged[uid] || {})[f.id]
        if (p && p.h === r.h && p.a === r.a) {
          events.push({
            type: 'exact',
            ts: new Date(f.kickoff).getTime() + 2,
            kicker: 'EXACT SCORE · +3',
            headline: `${firstName(members, uid)} called it`,
            lcd: { home: f.home, away: f.away, h: r.h, a: r.a },
          })
        }
      })
    })

    // Lead change
    const rank = Object.entries(totals).sort((a, b) => b[1] - a[1])
    const leader = rank[0] ? rank[0][0] : null
    if (leader && prevLeader && leader !== prevLeader) {
      events.push({
        type: 'lead',
        ts: endTs + 3,
        kicker: 'NEW LEADER',
        headline: `${firstName(members, leader)} hits the front`,
        sub: `Overtaking ${firstName(members, prevLeader)} after Matchday ${md}.`,
      })
    }
    prevLeader = leader
  })

  // ── Chip plays ──
  Object.entries(allChips || {}).forEach(([uid, chips]) => {
    Object.entries(chips || {}).forEach(([cid, data]) => {
      const meta = CHIP_LABELS[cid]
      if (!meta || !data) return
      const md = data.matchday
      const endTs = md ? matchdayEndTime(fixtures, md) : now
      const played = md != null && mds[md]?.complete
      const pts = played ? (mds[md].scores[uid] ?? 0) : null
      events.push({
        type: 'chip',
        ts: (endTs || now) - 1,
        kicker: `CHIP · ${meta.kind}`,
        headline: `${firstName(members, uid)} played ${meta.label}`,
        sub: played
          ? (pts > 0 ? `Returned ${pts} points.` : 'It backfired. Nought to show.')
          : `On Matchday ${md}. Watch this space.`,
      })
    })
  })

  // ── Gazette editions (one per completed matchday) ──
  doneMd.forEach(({ md, scores }) => {
    const top = Math.max(...Object.values(scores))
    if (top <= 0) return
    const w = Object.entries(scores).find(([, p]) => p === top)[0]
    events.push({
      type: 'gazette',
      ts: matchdayEndTime(fixtures, md) + 4,
      kicker: `THE ${(pool?.name || 'INTHELEAGUE').replace(/^the\s+/i, '').toUpperCase()} GAZETTE`,
      headline: `"${firstName(members, w)} delivers on MD${md}"`,
      sub: 'Read the full report →',
      md,
    })
  })

  // Sort: pinned first, then newest → oldest
  return events.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (b.pinned && !a.pinned) return 1
    return b.ts - a.ts
  })
}
