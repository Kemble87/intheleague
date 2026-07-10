import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { rtdb } from '../lib/firebase'
import { matchdayScores, calcPts, runInStart } from '../lib/helpers'
import Backdrop from './Backdrop'
import Ticker from './Ticker'

const GREEN = '#00E05A'
const DISP = "'Space Grotesk','Inter',sans-serif"

export default function Spectate({ poolId }) {
  const [pool, setPool] = useState(null)
  const [fixtures, setFixtures] = useState([])
  const [results, setResults] = useState({})
  const [allPicks, setAllPicks] = useState({})
  const [allChips, setAllChips] = useState({})
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const subs = [
      onValue(ref(rtdb, `pools/${poolId}`), s => { s.exists() ? setPool(s.val()) : setMissing(true) }, () => setMissing(true)),
      onValue(ref(rtdb, `pools/${poolId}/fixtures`), s => { if (s.exists()) setFixtures(Object.values(s.val()).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))) }),
      onValue(ref(rtdb, `pools/${poolId}/results`), s => setResults(s.val() || {})),
      onValue(ref(rtdb, `pools/${poolId}/picks`), s => setAllPicks(s.val() || {})),
      onValue(ref(rtdb, `pools/${poolId}/chips`), s => setAllChips(s.val() || {})),
    ]
    return () => subs.forEach(u => u())
  }, [poolId])

  if (missing) return (
    <Shell>
      <div style={{ textAlign: 'center', padding: '30vh 20px 0', color: '#555', fontSize: 15 }}>
        This league is private or doesn't exist.
        <div style={{ marginTop: 24 }}><CtaLink label="Start your own pool free →" /></div>
      </div>
    </Shell>
  )
  if (!pool) return <Shell><div style={{ textAlign: 'center', padding: '40vh 0', color: '#333', fontFamily: "'Share Tech Mono',monospace", fontSize: 12, letterSpacing: '.2em' }}>LOADING…</div></Shell>

  const members = Object.entries(pool.members || {})

  // Board — chip-aware via shared engine
  const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), allPicks, allChips)
  const totals = {}, mdWins = {}
  Object.values(mds).forEach(({ scores, complete }) => {
    Object.entries(scores).forEach(([uid, p]) => { totals[uid] = (totals[uid] || 0) + p })
    if (complete) {
      const top = Math.max(...Object.values(scores))
      if (top > 0) Object.entries(scores).forEach(([uid, p]) => { if (p === top) mdWins[uid] = (mdWins[uid] || 0) + 1 })
    }
  })
  const board = members.map(([uid, m]) => {
    const exact = (fixtures || []).filter(f => calcPts((allPicks[uid] || {})[f.id], results[f.id]) === 3).length
    return { uid, name: m.name || '?', pts: totals[uid] || 0, exact, wins: mdWins[uid] || 0 }
  }).sort((a, b) => b.pts - a.pts || b.exact - a.exact)

  const rankColors = ['#FFD60A', '#C0C0C0', '#CD7F32']

  return (
    <Shell>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0 26px' }}>
        <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.04em', color: '#fff' }}>In<em style={{ color: GREEN, fontStyle: 'normal' }}>The</em>League</div>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: '.16em', color: '#666', border: '1px solid #222', borderRadius: 500, padding: '5px 12px' }}>SPECTATOR VIEW</span>
      </div>

      {/* Hero-lite */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: GREEN, display: 'inline-block' }}/>
          Season 2026/27 · {members.length} player{members.length !== 1 ? 's' : ''}
        </div>
        <div style={{ fontFamily: DISP, fontSize: 'clamp(34px,9vw,56px)', fontWeight: 700, color: '#fff', letterSpacing: '-.03em', lineHeight: 1 }}>
          {pool.name}
        </div>
      </div>

      <Ticker pool={pool} members={members} allChips={allChips} fixtures={fixtures} allPicks={allPicks} results={results} />

      {/* Table */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#444', margin: '4px 0 12px' }}>Live standings</div>
      {board.map((row, i) => (
        <div key={row.uid} style={{ display: 'flex', alignItems: 'center', gap: 12, background: i === 0 && row.pts > 0 ? 'linear-gradient(90deg,#171303,#0d0d0d)' : '#0d0d0d', border: `1px solid ${i === 0 && row.pts > 0 ? '#FFD60A33' : '#161616'}`, borderRadius: 14, padding: '13px 14px', marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: i < 3 && row.pts > 0 ? rankColors[i] + '1a' : '#161616', border: `1.5px solid ${i < 3 && row.pts > 0 ? rankColors[i] + '55' : '#222'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontSize: 13, fontWeight: 700, color: i < 3 && row.pts > 0 ? rankColors[i] : '#555' }}>{i + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#fff' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
              {row.wins > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid #FFD60A44', borderRadius: 500, padding: '2px 8px', flexShrink: 0 }}>
                  <svg width="10" height="8" viewBox="0 0 12 9" fill="none"><path d="M1 8h10M1 8L.5 2.5 3.5 5 6 1l2.5 4 3-2.5L11 8" stroke="#FFD60A" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round"/></svg>
                  <span style={{ fontFamily: DISP, fontSize: 10, fontWeight: 700, color: '#FFD60A' }}>{row.wins}</span>
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{row.exact} exact score{row.exact !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ fontFamily: DISP, fontSize: 22, fontWeight: 700, color: i === 0 && row.pts > 0 ? GREEN : '#ddd' }}>{row.pts}</div>
        </div>
      ))}

      {/* CTA */}
      <div style={{ background: 'linear-gradient(160deg,#07180d,#0d0d0d 60%)', border: `1.5px solid ${GREEN}`, borderRadius: 18, padding: '26px 22px', textAlign: 'center', margin: '28px 0 40px', boxShadow: '0 20px 80px #00E05A14' }}>
        <div style={{ fontFamily: DISP, fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.15 }}>Your group chat needs one of these.</div>
        <div style={{ fontSize: 13, color: '#777', margin: '10px 0 20px', lineHeight: 1.6 }}>Free score prediction leagues — set up in 60 seconds.</div>
        <CtaLink label="Start your own pool free →" />
      </div>
    </Shell>
  )
}

function CtaLink({ label }) {
  return (
    <a href="/" onClick={() => { window.location.hash = '' }} style={{ display: 'inline-block', padding: '14px 30px', background: GREEN, color: '#000', borderRadius: 500, fontSize: 15, fontWeight: 800, textDecoration: 'none', letterSpacing: '-.01em' }}>{label}</a>
  )
}

function Shell({ children }) {
  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
      <Backdrop />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto', padding: '0 18px' }}>{children}</div>
    </div>
  )
}
