import { useState, useMemo } from 'react'
import { matchdayScores, runInStart } from '../lib/helpers'


const DISP = "'Space Grotesk','Inter',sans-serif"
const MONO = "'Share Tech Mono',ui-monospace,monospace"
const BEBAS = "'Bebas Neue',sans-serif"

const pick = (arr, seed) => arr[seed % arr.length]
const hash = s => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

export default function Bulletin({ pool, poolId, members, fixtures, results, allPicks, allChips, userId, userPicks }) {
    const [open, setOpen] = useState(false)
  const [autoDone, setAutoDone] = useState(false)

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

    const mdFx = (fixtures || []).filter(f => String(f.matchday) === String(md))
    const wPicks = merged[wUid] || {}
    const wExacts = mdFx.filter(f => {
      const p = wPicks[f.id], r = results[f.id]
      return p && r && p.h === r.h && p.a === r.a
    }).length

    const totalsUpTo = idx => {
      const t = {}
      done.slice(0, idx).forEach(([, v2]) => Object.entries(v2.scores).forEach(([u, p]) => { t[u] = (t[u] || 0) + p }))
      return Object.entries(t).sort((a, b) => b[1] - a[1])
    }
    const after = totalsUpTo(done.length)
    const before = totalsUpTo(done.length - 1)
    const leaderNow = after[0] ? nameOf(after[0][0]) : null
    const leaderBefore = before[0] ? nameOf(before[0][0]) : null
    const leadChanged = leaderBefore && leaderNow && leaderBefore !== leaderNow
    const gap = after.length > 1 ? after[0][1] - after[1][1] : 0

    const CHIP_NAMES = { '2x': 'the 2x Multiplier', banker: 'the Banker', hth: 'Half Time Hero', copycat: 'Copycat', coupon: 'the Coupon Buster' }
    const chipPlays = []
    Object.entries(allChips || {}).forEach(([uid, chips]) => {
      Object.entries(chips || {}).forEach(([cid, data]) => {
        if (CHIP_NAMES[cid] && String(data?.matchday) === String(md)) {
          chipPlays.push({ who: nameOf(uid), chip: CHIP_NAMES[cid], pts: scores[uid] ?? 0, won: uid === wUid })
        }
      })
    })

    const now = Date.now()
    const future = (fixtures || []).filter(f => new Date(f.kickoff).getTime() > now && f.matchday)
    const nextMd = future.length ? Math.min(...future.map(f => Number(f.matchday))) : null
    const riStart = runInStart(fixtures)

    const headline = pick([
      winner.toUpperCase() + ' TAKES MATCHDAY ' + md,
      winner.toUpperCase() + ' DELIVERS ON MD' + md,
      'MATCHDAY ' + md + ' BELONGS TO ' + winner.toUpperCase(),
      wPts + ' AND DONE: ' + winner.toUpperCase() + ' WINS MD' + md,
    ], seed)

    const standfirst = leadChanged
      ? leaderNow + ' seizes top spot as the table turns.'
      : gap > 0 && leaderNow
        ? leaderNow + ' stays clear at the summit — ' + gap + ' point' + (gap !== 1 ? 's' : '') + ' in hand.'
        : 'All square at the top and nothing settled.'

    const paras = []
    const exactBit = wExacts > 0 ? ', landing ' + wExacts + ' exact score' + (wExacts !== 1 ? 's' : '') + ' along the way' : ''
    const ruBit = runnerUp ? ' ' + runnerUp.name + ' pushed hard with ' + runnerUp.pts + ' but had to settle for second.' : ''
    paras.push(pick([
      winner + ' claimed the matchday crown with ' + wPts + ' points' + exactBit + '.' + ruBit,
      'A ' + wPts + '-point haul was enough for ' + winner + ' to take the crown' + exactBit + '.' + ruBit,
    ], seed + 1))

    if (chipPlays.length) {
      const c = chipPlays[0]
      paras.push(c.won
        ? 'Chip watch: ' + c.who + ' played ' + c.chip + ' — and it paid off handsomely.'
        : 'Chip watch: ' + c.who + ' gambled with ' + c.chip + ' for a ' + c.pts + '-point return. ' + pick(['The jury is out.', 'The group chat will decide if it was worth it.', 'Braver souls than most.'], seed + 2))
      if (chipPlays.length > 1) paras.push(chipPlays.length + ' chips were burned on MD' + md + ' in total — the arms race is officially on.')
    }

    if (spoon) {
      const sp = spoon.pts + ' point' + (spoon.pts !== 1 ? 's' : '')
      paras.push(pick([
        'At the other end, ' + spoon.name + ' takes the wooden spoon with ' + sp + '. No further questions at this time.',
        'The wooden spoon goes to ' + spoon.name + ' — ' + sp + ' and a week of silence recommended.',
        spoon.name + ' props up the matchday with ' + spoon.pts + ". There's always next week. Probably.",
      ], seed + 3))
    }

    if (nextMd) {
      paras.push(Number(nextMd) >= riStart
        ? 'Next up: Matchday ' + nextMd + " — and it's THE RUN-IN. Double points from here to the finish. Nobody is safe."
        : 'Next up: Matchday ' + nextMd + ". Picks lock at kickoff — don't be the one who forgot.")
    }

    return { md, headline, standfirst, paras }
    }, [pool, poolId, members, fixtures, results, allPicks, allChips, userId, userPicks])

  if (story && !autoDone) {
    setAutoDone(true)
    try {
      const k = 'bulletin-' + poolId + '-' + story.md
      if (!localStorage.getItem(k)) { localStorage.setItem(k, '1'); setOpen(true) }
    } catch (e) {}
  }

  if (!story) return null

  return (

    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '12px 18px', background: 'none',
        border: '1px solid #1e1e1e', borderRadius: open ? '14px 14px 0 0' : 14,
        color: '#888', font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 3h9v11H3.5A1.5 1.5 0 012 12.5V3z" stroke="#00E05A" strokeWidth="1.2"/><path d="M11 6h2.5v6.5a1.5 1.5 0 01-3 0" stroke="#00E05A" strokeWidth="1.2"/><path d="M4.5 6h4M4.5 8.5h4M4.5 11h2.5" stroke="#00E05A" strokeWidth="1.1" strokeLinecap="round"/></svg>
        The Back Page — Matchday {story.md} wrap
        <span style={{ color: '#444', fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ border: '1px solid #1e1e1e', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: '20px 20px 22px', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(255,255,255,.008) 0px,rgba(255,255,255,.008) 1px,transparent 1px,transparent 3px)', pointerEvents: 'none' }}/>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #1e1e1e', paddingBottom: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.22em', color: '#555' }}>THE INTHELEAGUE GAZETTE</span>
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.14em', color: '#3a3a3a' }}>MD{story.md} · FULL TIME EDITION</span>
          </div>
          <div style={{ fontFamily: BEBAS, fontSize: 'clamp(30px,8.5vw,44px)', color: '#fff', letterSpacing: '.02em', lineHeight: .96, marginBottom: 10 }}>
            {story.headline}
          </div>
          <div style={{ fontFamily: DISP, fontSize: 14, fontWeight: 700, color: '#00E05A', lineHeight: 1.4, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #161616' }}>
            {story.standfirst}
          </div>
          {story.paras.map((p, i) => (
            <p key={i} style={{ fontSize: 13.5, color: '#999', lineHeight: 1.75, margin: '0 0 12px' }}>
              {i === 0 ? <span style={{ float: 'left', fontFamily: BEBAS, fontSize: 44, lineHeight: .82, color: '#00E05A', paddingRight: 8 }}>{p[0]}</span> : null}
              {i === 0 ? p.slice(1) : p}
            </p>
          ))}
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.16em', color: '#333', marginTop: 16, textAlign: 'center' }}>■ FILED AUTOMATICALLY AT FULL TIME ■</div>
        </div>
      )}
    </div>
  )
}
