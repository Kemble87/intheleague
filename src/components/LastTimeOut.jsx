import { useState, useEffect, useMemo } from 'react'
import { matchdayScores } from '../lib/helpers'

const GREEN = '#00E05A'
const GOLD = '#FFD60A'
const DISP = "'Space Grotesk','Inter',sans-serif"
const MONO = "'Share Tech Mono',ui-monospace,monospace"


function computeRecap({ fixtures, results, allPicks, allChips, members, userId }) {
  if (!fixtures?.length || !members?.length) return null

  // group fixtures by matchday
  const byMd = {}
  fixtures.forEach(f => { (byMd[f.matchday] = byMd[f.matchday] || []).push(f) })

  // a matchday is complete when every fixture has a result
  const completed = Object.keys(byMd)
    .map(Number)
    .filter(md => byMd[md].every(f => results[f.id]?.h != null && results[f.id]?.a != null))
    .sort((a, b) => a - b)

  if (!completed.length) return null
  const md = completed[completed.length - 1]

  const uids = members.map(([uid]) => uid)
  const nameOf = uid => {
    const m = members.find(([id]) => id === uid)?.[1]
    return m?.name || m?.displayName || 'Player'
  }

const allMd = matchdayScores(fixtures, results, uids, allPicks || {}, allChips || {})
  const sumUpTo = limit => {
    const s = {}
    uids.forEach(uid => { s[uid] = 0 })
    Object.entries(allMd).forEach(([m, { scores }]) => {
      if (+m <= limit) uids.forEach(uid => { s[uid] += scores[uid] || 0 })
    })
    return s
  }
  const mdScores = allMd[md]?.scores || {}
  const totalNow = sumUpTo(md)
  const totalPrev = sumUpTo(md - 1)

  const rank = scores => [...uids].sort((a, b) => (scores[b] - scores[a]) || nameOf(a).localeCompare(nameOf(b)))
  const now = rank(totalNow), prev = rank(totalPrev)
  const rankNow = uid => now.indexOf(uid) + 1
  const move = uid => (prev.indexOf(uid) + 1) - rankNow(uid) // + = climbed

  const sortedMd = [...uids].sort((a, b) => mdScores[b] - mdScores[a])
  const crown = sortedMd[0]
  const spoon = sortedMd[sortedMd.length - 1]

  return {
    md,
    you: { pts: mdScores[userId] ?? 0, rank: rankNow(userId), move: move(userId) },
    crown: { name: nameOf(crown), pts: mdScores[crown] },
    spoon: uids.length > 2 && spoon !== crown ? { name: nameOf(spoon), pts: mdScores[spoon] } : null,
  }
}

const ord = n => n + (['th','st','nd','rd'][((n % 100) - 20) % 10] || ['th','st','nd','rd'][n % 100] || 'th')

export default function LastTimeOut({ fixtures, results, allPicks, members, userId, poolId }) {
 const recap = useMemo(
    () => computeRecap({ fixtures, results, allPicks, allChips, members, userId }),
    [fixtures, results, allPicks, allChips, members, userId]
  )

  const key = `ltoSeen-${poolId}`
  const [show, setShow] = useState(false)
  const [beat, setBeat] = useState(0)
  const [leaving, setLeaving] = useState(false)

  // trigger: latest completed md not yet seen; wait out PoolIntro (1.5s)
  useEffect(() => {
    if (!recap) return
    let seen = null
    try { seen = localStorage.getItem(key) } catch (e) {}
    if (String(recap.md) === seen) return
    const t = setTimeout(() => setShow(true), 1600)
    return () => clearTimeout(t)
  }, [recap, key])

  // beat choreography: 0 title → 1 you → 2 drama
  useEffect(() => {
    if (!show) return
    const t1 = setTimeout(() => setBeat(1), 1200)
    const t2 = setTimeout(() => setBeat(2), 3000)
    const t3 = setTimeout(dismiss, 5400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [show]) // eslint-disable-line

  function dismiss() {
    try { localStorage.setItem(key, String(recap.md)) } catch (e) {}
    setLeaving(true)
    setTimeout(() => setShow(false), 350)
  }

  if (!show || !recap) return null
  const { you, crown, spoon } = recap
  const moveTxt = you.move > 0 ? `▲ ${you.move} to ${ord(you.rank)}` : you.move < 0 ? `▼ ${Math.abs(you.move)} to ${ord(you.rank)}` : `▬ held ${ord(you.rank)}`
  const moveCol = you.move > 0 ? GREEN : you.move < 0 ? '#FF3B5C' : '#888'

  return (
    <div onClick={dismiss} style={{
      position: 'fixed', inset: 0, zIndex: 100000, cursor: 'pointer',
      background: 'radial-gradient(ellipse 120% 60% at 50% -10%, rgba(44,232,106,.10), transparent 55%), radial-gradient(ellipse 90% 50% at 50% 115%, rgba(44,232,106,.05), transparent 60%), #050705',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: leaving ? 0 : 1, transition: 'opacity .35s ease', padding: '0 8%', textAlign: 'center',
    }}>
      <style>{`
        @keyframes ltoUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .lto-a { animation: none !important; opacity: 1 !important; transform: none !important; } }
      `}</style>

      <div className="lto-a" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.28em', color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', animation: 'ltoUp .5s ease both' }}>
        Matchday {recap.md} · Last Time Out
      </div>

      {beat >= 1 && (
        <>
          <div className="lto-a" style={{ fontFamily: DISP, fontSize: 'clamp(52px,18vw,92px)', fontWeight: 800, color: '#fff', lineHeight: 1, marginTop: 28, animation: 'ltoUp .5s ease both' }}>
            {you.pts}<span style={{ fontSize: '0.3em', color: GREEN, fontWeight: 700, marginLeft: 6 }}>pts</span>
          </div>
          <div className="lto-a" style={{ fontFamily: DISP, fontSize: 16, fontWeight: 700, color: moveCol, marginTop: 10, animation: 'ltoUp .5s ease .15s both' }}>
            {moveTxt}
          </div>
        </>
      )}

      {beat >= 2 && (
        <div className="lto-a" style={{ marginTop: 34, animation: 'ltoUp .5s ease both' }}>
          <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 700, color: GOLD }}>
            👑 {crown.name} took the crown · {crown.pts}pts
          </div>
          {spoon && (
            <div style={{ fontFamily: DISP, fontSize: 13, fontWeight: 600, color: '#777', marginTop: 8 }}>
              🥄 The spoon goes to {spoon.name}. {spoon.pts}pts. No comment.
            </div>
          )}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom, 20px) + 16px)', fontFamily: MONO, fontSize: 10, letterSpacing: '.2em', color: 'rgba(255,255,255,.25)', textTransform: 'uppercase' }}>
        Tap to continue
      </div>
    </div>
  )
}
