import { useState, useEffect, useRef, useMemo } from 'react'
import { ref, onValue, set, update } from 'firebase/database'
import { rtdb } from '../lib/firebase'
import { SAMPLE_FIXTURES } from '../lib/constants'
import { fmtKO, fmtDay, groupDays, countdown, calcPts, abbr, fetchAndStoreFixtures, loadFixtures, matchdayScores, runInStart } from '../lib/helpers'
import Kit from './Kit'

const TEAM_NAMES = {
  'Nottingham': 'Nottm Forest',
  'Nott\'m Forest': 'Nottm Forest',
  'Manchester City': 'Man City',
  'Manchester United': 'Man United',
  'Tottenham Hotspur': 'Spurs',
  'Newcastle United': 'Newcastle',
  'West Ham United': 'West Ham',
  'Crystal Palace': 'Crystal Palace',
  'Wolverhampton': 'Wolves',
  'Brighton & Hove Albion': 'Brighton',
  'Leicester City': 'Leicester',
  'Ipswich Town': 'Ipswich',
}
function teamName(n) { return TEAM_NAMES[n] || n }

function NextToPick({ fixtures, picks, now, onGo }) {
  const next = useMemo(() => {
    if (!fixtures?.length) return null
    return fixtures.find(f => Date.parse(f.kickoff) > now && !(picks[f.id]?.h != null && picks[f.id]?.a != null))
  }, [fixtures, picks, now])

  if (!next) return null
  const t = new Date(next.kickoff) - now
  const h = Math.floor(t / 3.6e6), m = Math.floor((t % 3.6e6) / 6e4), d = Math.floor(h / 24)
  const cdStr = d > 1 ? `${d} days` : `${h}h ${m}m`
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(next.kickoff)).reduce((a, b) => (a[b.type] = b.value, a), {})

  return (
    <div className="ntp">
      <div className="ntp-label">⏱ Next to pick</div>
      <div className="ntp-match">
        <div className="ntp-team">{teamName(next.home)}</div>
        <div className="ntp-center">
          <span className="ntp-time">{p.weekday} {p.day} {p.month} · {p.hour}:{p.minute}</span>
          <span className="ntp-cd">locks in {cdStr}</span>
        </div>
        <div className="ntp-team away">{teamName(next.away)}</div>
      </div>
      <button className="ntp-go" onClick={onGo}>Pick this match →</button>
    </div>
  )
}

function MatchdaySummary({ fixtures, picks, results, matchday, allPicks }) {
  const mxs = matchday === 'ALL' ? fixtures : (fixtures || []).filter(f => String(f.matchday) === String(matchday))
  if (!mxs?.length) return null
  const played = mxs.filter(f => results[f.id]?.h != null)
  if (!played.length) return null
  const myPts = played.reduce((s, f) => { const p = calcPts(picks[f.id], results[f.id]); return p != null ? s + p : s }, 0)
  const myExact = played.filter(f => calcPts(picks[f.id], results[f.id]) === 3).length
  const myPicked = mxs.filter(f => picks[f.id]?.h != null).length
  let nh = 0, nd = 0, na = 0, total = 0
  played.forEach(f => {
    Object.values(allPicks || {}).forEach(mp => {
      const p = (mp || {})[f.id]
      if (p?.h != null && p?.a != null) { total++; if (p.h > p.a) nh++; else if (p.h === p.a) nd++; else na++ }
    })
  })
  return (
    <>
      <div className="md-summary">
        <div className="md-sum-stat"><div className="md-sum-num green">{myPts}</div><div className="md-sum-label">My pts</div></div>
        <div className="md-sum-stat"><div className="md-sum-num gold">{myExact}</div><div className="md-sum-label">Exact</div></div>
        <div className="md-sum-stat"><div className="md-sum-num">{myPicked}/{mxs.length}</div><div className="md-sum-label">Picked</div></div>
      </div>
      {total > 0 && (
        <div className="split-bar-wrap">
          <div className="split-bar-label">
            <span style={{ color: '#4488FF' }}>Home {Math.round(nh / total * 100)}%</span>
            <span style={{ color: '#444' }}>Draw {Math.round(nd / total * 100)}%</span>
            <span style={{ color: '#FF3B5C' }}>Away {Math.round(na / total * 100)}%</span>
          </div>
          <div className="split-bar">
            <div className="split-h" style={{ flex: nh || 0.001 }} />
            <div className="split-d" style={{ flex: nd || 0.001 }} />
            <div className="split-a" style={{ flex: na || 0.001 }} />
          </div>
        </div>
      )}
    </>
  )
}

function FxCard({ fx, pick, result, now, isOrg, members, allPicks, allChips, userId, runIn, onPick, onResult }) {
  const ko = new Date(fx.kickoff).getTime()
  const chips = {} // loaded per-user at pool level, passed via prop if needed
  const matchMins = (now - ko) / 60000
  const isHalfTime = matchMins >= 45 && matchMins <= 62
  const locked = now >= ko && !isHalfTime
  const revealed = now >= ko
  const hasRes = result?.h != null && result?.a != null
  const p = calcPts(pick, result)
  const ct = countdown(fx.kickoff, now)
    const display = locked && hasRes ? result : pick
  const awayRef = useRef(null)

  function onChange(side, raw) {
    const v = raw.replace(/[^0-9]/g, '').slice(0, 2)
    const n = v === '' ? null : Math.min(99, +v)
     isOrg && locked ? onResult(side, n) : onPick(side, n)
    if (side === 'h' && n != null) awayRef.current?.focus()
  }


  return (
    <div className="fx">
      <div className="fx-time-row">
        <span className="fx-time">{fmtKO(fx.kickoff)}</span>
        <div className="fx-badges">
          {/* Chip indicators */}
          {allChips && userId && (() => { const mc = allChips[userId] || {}; return null })() }
          {runIn &&
            <span style={{ fontFamily:"'Share Tech Mono',ui-monospace,monospace", fontSize:9, letterSpacing:'.1em', fontWeight:700, padding:'2px 8px', borderRadius:500, background:'#1a0505', color:'#FF3B5C', border:'1px solid #FF3B5C44' }}>RUN-IN 2×</span>}
          {allChips?.[userId]?.['2x']?.matchday && String(allChips[userId]['2x'].matchday) === String(fx.matchday) &&
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:500, background:'#1a0800', color:'#FFD700', border:'1px solid #FFD70044' }}>⚡ 2×</span>}
          {allChips?.[userId]?.['banker']?.fixtureId === fx.id &&
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:500, background:'#000820', color:'#4499FF', border:'1px solid #4499FF44' }}>🏦 3×</span>}
          {allChips?.[userId]?.['hth']?.matchday && String(allChips[userId]['hth'].matchday) === String(fx.matchday) && !result?.h &&
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:500, background:'#0d001a', color:'#9966FF', border:'1px solid #9966FF44' }}>⏱</span>}
          {allChips?.[userId]?.['coupon']?.matchday && String(allChips[userId]['coupon'].matchday) === String(fx.matchday) &&
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:500, background:'#001a08', color:'#4CAF50', border:'1px solid #4CAF5044' }}>🎟</span>}
          {ct && <span className="pill pill-cd">🔒 {ct}</span>}
          {locked && !hasRes && !isOrg && <span className="pill pill-ko">Kicked off</span>}
          {hasRes && pick?.h != null && <span className={`pill ${p === 3 ? 'pill-p3' : p === 1 ? 'pill-p1' : 'pill-p0'}`}>{p === 3 ? '+3 exact' : p === 1 ? '+1 result' : '0 pts'}</span>}
        </div>
      </div>
      <div className="fx-match">
        <div className="fx-home">
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Kit team={teamName(fx.home)} crest={fx.homeCrest} size={24} />
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(14px,4vw,20px)", color:'#fff', letterSpacing:'.06em', lineHeight:1 }}>{teamName(fx.home)}</div>
              <div className="fx-team-abbr">{abbr(teamName(fx.home))}</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:3, padding:'0 6px' }}>
          <div style={{ width:44, height:56, background:'#060606', border:'1.5px solid #1a1a1a', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg,rgba(0,0,0,.1) 0px,rgba(0,0,0,.1) 1px,transparent 1px,transparent 3px)', pointerEvents:'none', zIndex:1 }}/>
            {(!locked || isOrg) && <input inputMode="numeric" value={display?.h ?? ''} onChange={e => onChange('h', e.target.value)} disabled={locked && !isOrg} aria-label={fx.home} style={{ position:'absolute', inset:0, opacity:0, cursor: locked&&!isOrg?'not-allowed':'pointer', zIndex:3, fontSize:32, textAlign:'center', background:'none', border:'none', WebkitAppearance:'none' }}/>}
            <div style={{ fontFamily:"'Share Tech Mono',ui-monospace,monospace", fontSize:'clamp(22px,7vw,32px)', lineHeight:1, position:'relative', zIndex:2,
              color: locked && hasRes ? '#ff6600' : display?.h != null ? '#00ff66' : '#1a0800',
              textShadow: locked && hasRes ? '0 0 8px #ff440066' : display?.h != null ? '0 0 8px #00ff4466' : 'none'
            }}>{display?.h ?? '–'}</div>
          </div>
          <span style={{ fontFamily:"'Share Tech Mono',ui-monospace,monospace", fontSize:'clamp(16px,5vw,22px)', color:'#2a2a2a', lineHeight:1, padding:'0 1px', marginBottom:2 }}>:</span>
          <div style={{ width:44, height:56, background:'#060606', border:'1.5px solid #1a1a1a', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg,rgba(0,0,0,.1) 0px,rgba(0,0,0,.1) 1px,transparent 1px,transparent 3px)', pointerEvents:'none', zIndex:1 }}/>
             {(!locked || isOrg) && <input ref={awayRef} inputMode="numeric" value={display?.a ?? ''}
onChange={e => onChange('a', e.target.value)} disabled={locked && !isOrg} aria-label={fx.away} style={{ position:'absolute', inset:0, opacity:0, cursor: locked&&!isOrg?'not-allowed':'pointer', zIndex:3, fontSize:32, textAlign:'center', background:'none', border:'none', WebkitAppearance:'none' }}/>}
            <div style={{ fontFamily:"'Share Tech Mono',ui-monospace,monospace", fontSize:'clamp(22px,7vw,32px)', lineHeight:1, position:'relative', zIndex:2,
              color: locked && hasRes ? '#ff6600' : display?.a != null ? '#00ff66' : '#1a0800',
              textShadow: locked && hasRes ? '0 0 8px #ff440066' : display?.a != null ? '0 0 8px #00ff4466' : 'none'
            }}>{display?.a ?? '–'}</div>
          </div>
        </div>
        <div className="fx-away">
          <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-end' }}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(14px,4vw,20px)", color:'#fff', letterSpacing:'.06em', lineHeight:1 }}>{teamName(fx.away)}</div>
              <div className="fx-team-abbr">{abbr(teamName(fx.away))}</div>
            </div>
            <Kit team={teamName(fx.away)} crest={fx.awayCrest} size={24} flip />
          </div>
        </div>
      </div>
      {(hasRes || locked) && (
        <div className="fx-status">
          {hasRes ? <span><span className="fx-ft">FT</span><span className="fx-ft-score">{result.h} – {result.a}</span></span> : <span className="fx-hint">Awaiting result</span>}
          {locked && isOrg && <span className="fx-org-save">{hasRes ? '✓ Saved' : 'Enter above'}</span>}
        </div>
      )}
      {!revealed && members && members.length > 1 && (
        <div style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 14px 10px', borderTop:'1px solid #0a0a0a' }}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="#333" strokeWidth="1.3"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="#333" strokeWidth="1.3"/></svg>
          <span style={{ fontFamily:"'Share Tech Mono',ui-monospace,monospace", fontSize:10, letterSpacing:'.12em', color:'#333' }}>PICKS HIDDEN UNTIL KICKOFF</span>
        </div>
      )}
      {revealed && allPicks && members && members.length > 1 && (
        <div className="picks-row">
          {members.map(([uid, m]) => {
            const mp = (allPicks[uid] || {})[fx.id]
            const s = calcPts(mp, result)
            const cls = s === 3 ? 'p3' : s === 1 ? 'p1' : mp?.h != null ? 'p0' : 'pn'
            return (
              <span key={uid} className={`pick-chip ${cls}`} title={m.name}>
                {abbr(m.name).slice(0, 2)}{mp?.h != null ? ` ${mp.h}-${mp.a}` : ' –'}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Fixtures({ poolId, pool, user, picks, allPicks, results, onSavePick, onSaveResult }) {
  const [fixtures, setFixtures] = useState([])
  const [loading, setLoading] = useState(true)
  const [matchday, setMatchday] = useState('ALL')
  const [now, setNow] = useState(Date.now())
  const [allChips, setAllChips] = useState({})
  const [tab, setTab] = useState('picks')
  const [h2h, setH2h] = useState(null)

  const isOrg = pool.createdBy === user.uid || pool.members?.[user.uid]?.isOrganiser
  const members = Object.entries(pool.members || {})

  useEffect(() => { const iv = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(iv) }, [])

  // Open on the current matchday rather than the full-season scroll
  const defaultedFor = useRef(null)
  useEffect(() => {
    if (!fixtures.length || defaultedFor.current === poolId) return
    const tNow = Date.now()
    const future = fixtures.filter(f => new Date(f.kickoff).getTime() > tNow && f.matchday)
    const md = future.length
      ? Math.min(...future.map(f => Number(f.matchday)))
      : Math.max(...fixtures.map(f => Number(f.matchday) || 1))
    setMatchday(String(md))
    defaultedFor.current = poolId
  }, [fixtures, poolId])

  useEffect(() => {
    setLoading(true)
    loadFixtures(poolId, rtdb).then(fx => { setFixtures(fx.length > 0 ? fx : SAMPLE_FIXTURES); setLoading(false) })
  }, [poolId])

  useEffect(() => {
    const r = ref(rtdb, 'pools/' + poolId + '/fixtures')
    const u = onValue(r, s => { if (s.exists()) setFixtures(Object.values(s.val()).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))) })
    return () => u()
  }, [poolId])

  useEffect(() => {
    const r = ref(rtdb, 'pools/' + poolId + '/chips')
    const u = onValue(r, s => setAllChips(s.val() || {}))
    return () => u()
  }, [poolId])

  const mdays = [...new Set((fixtures || []).map(f => f.matchday).filter(Boolean))].sort((a, b) => a - b)
  const futureFx = (fixtures || []).filter(f => new Date(f.kickoff).getTime() > now && f.matchday)
  const currentMd = futureFx.length ? Math.min(...futureFx.map(f => Number(f.matchday))) : (mdays[mdays.length - 1] || 1)
  const filtered = matchday === 'ALL' ? fixtures : (fixtures || []).filter(f => String(f.matchday) === String(matchday))
  const days = groupDays(filtered)

  const totalPts = (fixtures || []).reduce((s, f) => { const p = calcPts(picks[f.id], results[f.id]); return p != null ? s + p : s }, 0)
  const exactPts = (fixtures || []).filter(f => calcPts(picks[f.id], results[f.id]) === 3).length
  const totalPicks = (fixtures || []).filter(f => picks[f.id]?.h != null).length

  // Apply chip effects to scoring
  function calcPtsWithChips(uid, fid, pick, result, matchdayNum) {
    const base = calcPts(pick, result)
    if (base == null) return null
    const chips = allChips[uid] || {}
    let multiplier = Number(matchdayNum) >= runInStart(fixtures) ? 2 : 1
    // 2x chip — doubles all points for chosen matchday
    if (chips['2x']?.matchday && String(chips['2x'].matchday) === String(matchdayNum)) multiplier *= 2
    // Banker chip — triples points for chosen fixture
    if (chips['banker']?.fixtureId === fid) multiplier *= 3
    return base * multiplier
  }

  function applyMatchdayChips(uid, matchdayFixtures, ptsArr) {
    const chips = allChips[uid] || {}
    // Coupon Buster — rescue worst result for chosen matchday
    if (chips['coupon']?.matchday) {
      const mdNum = chips['coupon'].matchday
      const mdFx = matchdayFixtures.filter(f => String(f.matchday) === String(mdNum))
      if (mdFx.length > 0) {
        // Find worst scoring fixture index and upgrade it
        let worstIdx = -1, worstPts = Infinity
        ptsArr.forEach((p, i) => { if (p != null && p < worstPts) { worstPts = p; worstIdx = i } })
        if (worstIdx >= 0 && worstPts < 3) {
          ptsArr[worstIdx] = Math.min(3, worstPts + (worstPts === 0 ? 1 : 2))
        }
      }
    }
    return ptsArr
  }

  const board = members.map(([uid, m]) => {
    let p = 0, ex = 0, md = 0
    // Copycat — use target's picks if chip active
    const chips = allChips[uid] || {}
    const copyTargetUid = chips['copycat']?.targetUid
    const copyMatchday = chips['copycat']?.matchday
    const mp = uid === user.uid ? picks : (allPicks[uid] || {})
    ;(fixtures || []).forEach(f => {
      // Apply copycat for the chosen matchday
      let pk = mp[f.id]
      if (copyTargetUid && String(f.matchday) === String(copyMatchday)) {
        pk = (allPicks[copyTargetUid] || {})[f.id] || pk
      }
      const rs = results[f.id]
      if (pk?.h != null) md++
      const s = calcPtsWithChips(uid, f.id, pk, rs, f.matchday)
      if (s != null) { p += s; if (calcPts(pk, rs) === 3) ex++ }
    })
    return { uid, name: m.name, pts: p, exact: ex, made: md, isMe: uid === user.uid }
  }).sort((a, b) => b.pts - a.pts || b.exact - a.exact)
  // Matchday wins — chip-aware, only completed matchdays count
  const mdWins = {}
  {
    const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), { ...allPicks, [user.uid]: picks }, allChips)
    Object.values(mds).forEach(({ scores, complete }) => {
      if (!complete) return
      const top = Math.max(...Object.values(scores))
      if (top <= 0) return
      Object.entries(scores).forEach(([uid, p]) => { if (p === top) mdWins[uid] = (mdWins[uid] || 0) + 1 })
    })
  }

  // Live matchday — some results in, but not all: the table is in motion
  const liveMd = (() => {
    const byMd = {}
    ;(fixtures || []).forEach(f => { (byMd[f.matchday] = byMd[f.matchday] || []).push(f) })
    const hit = Object.entries(byMd).find(([, fxs]) => {
      const done = fxs.filter(f => results[f.id]?.h != null).length
      return done > 0 && done < fxs.length
    })
    return hit ? hit[0] : null
  })()

  // Rank movement: position now vs position before this matchday's results
  const rankDelta = {}
  if (liveMd != null) {
    const prev = members.map(([uid]) => {
      const chips = allChips[uid] || {}
      const copyT = chips['copycat']?.targetUid, copyMd = chips['copycat']?.matchday
      const mp = uid === user.uid ? picks : (allPicks[uid] || {})
      let p = 0
      ;(fixtures || []).forEach(f => {
        if (String(f.matchday) === String(liveMd)) return
        let pk = mp[f.id]
        if (copyT && String(f.matchday) === String(copyMd)) pk = (allPicks[copyT] || {})[f.id] || pk
        const s = calcPtsWithChips(uid, f.id, pk, results[f.id], f.matchday)
        if (s != null) p += s
      })
      return { uid, pts: p }
    }).sort((a, b) => b.pts - a.pts)
    const prevRank = {}
    prev.forEach((r, i) => { prevRank[r.uid] = i })
    board.forEach((r, i) => { rankDelta[r.uid] = (prevRank[r.uid] ?? i) - i })
  }

  return (
    <>


      <NextToPick fixtures={fixtures} picks={picks} now={now} onGo={() => {
        setTab('picks')
        setTimeout(() => {
          const el = document.querySelector('.fx')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }} />

      <div className="tabs">
        <button className={`tab${tab === 'picks' ? ' on' : ''}`} onClick={() => setTab('picks')}>{isOrg ? 'Picks & results' : 'My picks'}</button>
        <button className={`tab${tab === 'board' ? ' on' : ''}`} onClick={() => setTab('board')}>Leaderboard</button>
      </div>

      {tab === 'picks' ? (
        <>
          <div className="fx-controls">
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 10, padding: 3 }}>
              <button
                onClick={() => {
                  if (matchday === 'ALL') { setMatchday(String(currentMd)); return }
                  const i = mdays.indexOf(Number(matchday))
                  if (i > 0) setMatchday(String(mdays[i - 1]))
                  else setMatchday('ALL')
                }}
                style={{ width: 36, height: 36, background: 'none', border: 'none', borderRadius: 8, color: '#666', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
              >‹</button>
              <div style={{ flex: 1, textAlign: 'center', fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-.01em' }}>
                {matchday === 'ALL' ? 'All matchdays' : `Matchday ${matchday}`}
              </div>
              <button
                onClick={() => {
                  if (matchday === 'ALL') { setMatchday(String(currentMd)); return }
                  const i = mdays.indexOf(Number(matchday))
                  if (i < mdays.length - 1) setMatchday(String(mdays[i + 1]))
                }}
                style={{ width: 36, height: 36, background: 'none', border: 'none', borderRadius: 8, color: '#666', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}
              >›</button>
            </div>
            {isOrg && (
              <button className="sync-btn" onClick={async () => {
                try { const fx = await fetchAndStoreFixtures(pool.sport, poolId, rtdb); alert(fx.length > 0 ? `Synced ${fx.length} fixtures!` : 'No fixtures found') }
                catch (e) { alert('Error: ' + e.message) }
              }}>⟳ Sync</button>
            )}
          </div>
          {isOrg && <div className="org-note">Results sync automatically — as organiser you can correct any score by typing over it.</div>}
          <MatchdaySummary fixtures={filtered} picks={picks} results={results} matchday={matchday} allPicks={allPicks} />
          {loading ? (
            <div>
              <style>{`@keyframes skel { 0% { opacity: .4; } 50% { opacity: .8; } 100% { opacity: .4; } }`}</style>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ background: '#0d0d0d', border: '1px solid #141414', borderRadius: 14, padding: 16, marginBottom: 10, animation: `skel 1.4s ease-in-out ${i * .15}s infinite` }}>
                  <div style={{ width: '38%', height: 9, background: '#1a1a1a', borderRadius: 99, marginBottom: 14 }}/>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ width: '26%', height: 14, background: '#1a1a1a', borderRadius: 99 }}/>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div style={{ width: 40, height: 50, background: '#101010', border: '1px solid #1a1a1a', borderRadius: 6 }}/>
                      <div style={{ width: 40, height: 50, background: '#101010', border: '1px solid #1a1a1a', borderRadius: 6 }}/>
                    </div>
                    <div style={{ width: '26%', height: 14, background: '#1a1a1a', borderRadius: 99 }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : days.map(day => (
            <div key={day.d}>
              <div className="day-hd">{day.label}</div>
              {day.items.map(f => (
                <FxCard key={f.id} fx={f} pick={picks[f.id]} result={results[f.id]} now={now} isOrg={isOrg} members={members} allPicks={allPicks}
                  allChips={allChips} userId={user.uid} runIn={Number(f.matchday) >= runInStart(fixtures)}
                  onPick={(s, v) => onSavePick(f.id, s, v)}
                  onResult={(s, v) => onSaveResult(f.id, s, v)}
                />
              ))}
            </div>
          ))}
        </>
      ) : (
        <div className="board">
          {liveMd != null && board.length > 1 && (
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:14 }}>
              <style>{`@keyframes livePulse { 0%,100% { opacity:1; } 50% { opacity:.25; } }`}</style>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#FF3B5C', animation:'livePulse 1.6s ease-in-out infinite' }}/>
              <span style={{ fontFamily:"'Share Tech Mono',ui-monospace,monospace", fontSize:11, letterSpacing:'.14em', color:'#FF3B5C' }}>LIVE · MATCHDAY {liveMd} · AS IT STANDS</span>
            </div>
          )}
          {board.length >= 3 && board[0].pts > 0 && (
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:10, padding:'8px 0 20px' }}>
              {[1, 0, 2].map(pos => {
                const r = board[pos]
                if (!r) return null
                const heights = { 0: 88, 1: 64, 2: 52 }
                const colors = { 0: '#FFD60A', 1: '#C0C0C0', 2: '#CD7F32' }
                return (
                  <div key={r.uid} style={{ display:'flex', flexDirection:'column', alignItems:'center', width:92 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:colors[pos]+'1a', border:`1.5px solid ${colors[pos]}66`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:14, fontWeight:700, color:colors[pos], marginBottom:8 }}>
                      {(r.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div style={{ fontSize:11, fontWeight:700, color:'#ccc', marginBottom:2, maxWidth:88, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name?.split(' ')[0]}</div>
                    <div style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:15, fontWeight:700, color:colors[pos], marginBottom:8 }}>{r.pts}</div>
                    <div style={{ width:'100%', height:heights[pos], background:`linear-gradient(180deg, ${colors[pos]}22, ${colors[pos]}08)`, border:`1px solid ${colors[pos]}33`, borderBottom:'none', borderRadius:'8px 8px 0 0', display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:8, fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:18, fontWeight:700, color:colors[pos]+'aa' }}>
                      {pos + 1}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {board.map((row, i) => {
            const leader = board[0]
            const above = i > 0 ? board[i - 1] : null
            const gap = above ? above.pts - row.pts : 0
            const rankColors = ['#FFD60A', '#C0C0C0', '#CD7F32']
            const rankColor = i < 3 && row.pts > 0 ? rankColors[i] : '#555'
            const rowChips = allChips[row.uid] || {}
            const chipsPlayed = Object.keys(rowChips).length
            // Form streak: consecutive scoring picks, latest first
            let streak = 0
            {
              const played = (fixtures || []).filter(f => results[f.id]?.h != null)
                .sort((a, b) => new Date(b.kickoff) - new Date(a.kickoff))
              const mp2 = row.uid === user.uid ? picks : (allPicks[row.uid] || {})
              for (const f of played) {
                const p2 = calcPts(mp2[f.id], results[f.id])
                if (p2 === null) continue
                if (p2 > 0) streak++
                else break
              }
            }
            // Form: last completed matchday points
            const doneMds = [...new Set((fixtures || []).filter(f => results[f.id]?.h != null).map(f => f.matchday))].sort((a, b) => b - a)
            const lastMd = doneMds[0]
            let lastMdPts = null
            if (lastMd != null) {
              const mp = row.uid === user.uid ? picks : (allPicks[row.uid] || {})
              lastMdPts = (fixtures || []).filter(f => String(f.matchday) === String(lastMd)).reduce((s, f) => {
                const p = calcPtsWithChips(row.uid, f.id, mp[f.id], results[f.id], f.matchday)
                return p != null ? s + p : s
              }, 0)
            }
            return (
              <div key={row.uid} onClick={() => !row.isMe && setH2h(row.uid)} className={`board-row${i === 0 && row.pts > 0 ? ' gold' : ''}${row.isMe ? ' me' : ''}`} style={{ cursor: row.isMe ? 'default' : 'pointer' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: i < 3 && row.pts > 0 ? rankColor + '1a' : '#161616',
                  border: `1.5px solid ${i < 3 && row.pts > 0 ? rankColor + '55' : '#222'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 14, fontWeight: 700, color: rankColor,
                }}>{i + 1}</div>
                <div className="board-info">
                  <div className="board-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {row.name}{row.isMe && <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--green)', background: '#00E05A1a', borderRadius: 500, padding: '2px 7px', letterSpacing: '.08em' }}>YOU</span>}
                    {mdWins[row.uid] > 0 && (
                      <span title={`${mdWins[row.uid]} matchday win${mdWins[row.uid] !== 1 ? 's' : ''}`} style={{ display:'inline-flex', alignItems:'center', gap:4, border:'1px solid #FFD60A44', borderRadius:500, padding:'2px 8px' }}>
                        <svg width="10" height="8" viewBox="0 0 12 9" fill="none"><path d="M1 8h10M1 8L.5 2.5 3.5 5 6 1l2.5 4 3-2.5L11 8" stroke="#FFD60A" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round"/></svg>
                        <span style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:10, fontWeight:700, color:'#FFD60A' }}>{mdWins[row.uid]}</span>
                      </span>
                    )}
                  </div>
                  <div className="board-detail" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span>{row.exact} exact</span>
                    {streak >= 3 && <span style={{ color: '#ff6600', fontWeight: 700 }}>· {streak} on the spin</span>}
                    {i > 0 && gap > 0 && <span style={{ color: '#666' }}>· {gap} pt{gap !== 1 ? 's' : ''} behind</span>}
                    {i === 0 && row.pts > 0 && board.length > 1 && <span style={{ color: '#FFD60A' }}>· leading</span>}
                    {chipsPlayed > 0 && <span style={{ color: '#555' }}>· {chipsPlayed} chip{chipsPlayed !== 1 ? 's' : ''} played</span>}
                  </div>
                </div>
                {liveMd != null && rankDelta[row.uid] != null && rankDelta[row.uid] !== 0 && (
                  <span style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:12, fontWeight:700, color: rankDelta[row.uid] > 0 ? 'var(--green)' : '#FF3B5C', flexShrink:0 }}>
                    {rankDelta[row.uid] > 0 ? '▲' : '▼'}{Math.abs(rankDelta[row.uid])}
                  </span>
                )}
                <div style={{ textAlign: 'right' }}>
                  <div className="board-pts">{row.pts}</div>
                  {lastMdPts != null && lastMdPts > 0
                    ? <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', marginTop: 1 }}>+{lastMdPts} last MD</div>
                    : <div className="board-pts-label">pts</div>
                  }
                </div>
              </div>
            )
          })}
          {board.length === 1 && (
            <div style={{ textAlign: 'center', padding: '28px 20px', color: '#444', fontSize: 13, lineHeight: 1.6 }}>
              It's lonely at the top. Invite your mates from the menu — the leaderboard comes alive with rivals.
            </div>
          )}
        </div>
      )}

      {/* Head-to-head rivalry sheet */}
      {h2h && (() => {
        const rival = members.find(([uid]) => uid === h2h)
        if (!rival) return null
        const rivalName = (rival[1].name || '?').split(' ')[0]
        const myName = ((members.find(([uid]) => uid === user.uid) || [null, {}])[1].name || 'You').split(' ')[0]
        const myRow = board.find(r => r.uid === user.uid) || { pts: 0, exact: 0 }
        const theirRow = board.find(r => r.uid === h2h) || { pts: 0, exact: 0 }
        const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), { ...allPicks, [user.uid]: picks }, allChips)
        const completed = Object.entries(mds).filter(([, v]) => v.complete).sort((a, b) => Number(a[0]) - Number(b[0]))
        let myWins = 0, theirWins = 0, ties = 0, streakOwner = null, streak = 0
        let blow = { margin: 0, md: null, mine: false }
        completed.forEach(([md, { scores }]) => {
          const a = scores[user.uid] || 0, b = scores[h2h] || 0
          if (a > b) myWins++; else if (b > a) theirWins++; else ties++
          const w = a > b ? 'me' : b > a ? 'them' : null
          if (w) { if (w === streakOwner) streak++; else { streakOwner = w; streak = 1 } }
          else { streakOwner = null; streak = 0 }
          const m = Math.abs(a - b)
          if (m > blow.margin) blow = { margin: m, md, mine: a > b }
        })
        const Stat = ({ label, a, b }) => {
          const total = (a + b) || 1
          return (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:16, fontWeight:700, color: a >= b ? 'var(--green)' : '#888' }}>{a}</span>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'#444', alignSelf:'center' }}>{label}</span>
                <span style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:16, fontWeight:700, color: b > a ? '#FF3B5C' : '#888' }}>{b}</span>
              </div>
              <div style={{ display:'flex', height:4, borderRadius:99, overflow:'hidden', background:'#161616' }}>
                <div style={{ flex: a || .001, background:'var(--green)', opacity:.85 }}/>
                <div style={{ flex: b || .001, background:'#FF3B5C', opacity:.75 }}/>
              </div>
            </div>
          )
        }
        return (
          <div onClick={() => setH2h(null)} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.9)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end' }}>
            <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:480, background:'#111', border:'1px solid #1a1a1a', borderBottom:'none', borderRadius:'20px 20px 0 0', padding:'22px 22px 42px' }}>
              <div style={{ width:28, height:3, background:'#333', borderRadius:99, margin:'0 auto 22px' }}/>
              {/* VS header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:18, marginBottom:6 }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'#00E05A1a', border:'1.5px solid #00E05A55', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:17, fontWeight:700, color:'var(--green)', margin:'0 auto 8px' }}>{myName.slice(0,2).toUpperCase()}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{myName}</div>
                </div>
                <div style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:30, fontWeight:700, color:'#fff', letterSpacing:'-.02em' }}>
                  {myWins}<span style={{ color:'#333', padding:'0 8px', fontSize:20 }}>—</span>{theirWins}
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'#FF3B5C1a', border:'1.5px solid #FF3B5C55', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:17, fontWeight:700, color:'#FF3B5C', margin:'0 auto 8px' }}>{rivalName.slice(0,2).toUpperCase()}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{rivalName}</div>
                </div>
              </div>
              <div style={{ textAlign:'center', fontSize:10, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', color:'#444', marginBottom:24 }}>
                Matchday record{ties > 0 ? ` · ${ties} shared` : ''}
              </div>

              <Stat label="Season points" a={myRow.pts} b={theirRow.pts} />
              <Stat label="Exact scores" a={myRow.exact} b={theirRow.exact} />

              {/* Streak + blowout */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:20 }}>
                <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:12, padding:'14px 14px' }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'#444', marginBottom:6 }}>Current streak</div>
                  <div style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:15, fontWeight:700, color: streakOwner === 'me' ? 'var(--green)' : streakOwner === 'them' ? '#FF3B5C' : '#555' }}>
                    {streakOwner ? `${streakOwner === 'me' ? myName : rivalName} · ${streak} straight` : 'All square'}
                  </div>
                </div>
                <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderRadius:12, padding:'14px 14px' }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'#444', marginBottom:6 }}>Biggest blowout</div>
                  <div style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:15, fontWeight:700, color: blow.md ? (blow.mine ? 'var(--green)' : '#FF3B5C') : '#555' }}>
                    {blow.md ? `MD${blow.md} · by ${blow.margin}` : 'Nothing yet'}
                  </div>
                </div>
              </div>

              <button onClick={() => setH2h(null)} style={{ width:'100%', marginTop:22, padding:14, background:'none', border:'1px solid #222', borderRadius:500, color:'#555', font:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Close</button>
            </div>
          </div>
        )
      })()}
    </>
  )
}

