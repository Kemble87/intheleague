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

  function onChange(side, raw) {
    const v = raw.replace(/[^0-9]/g, '').slice(0, 2)
    const n = v === '' ? null : Math.min(99, +v)
    isOrg && locked ? onResult(side, n) : onPick(side, n)
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
            <Kit team={teamName(fx.home)} size={24} />
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
            {(!locked || isOrg) && <input inputMode="numeric" value={display?.a ?? ''} onChange={e => onChange('a', e.target.value)} disabled={locked && !isOrg} aria-label={fx.away} style={{ position:'absolute', inset:0, opacity:0, cursor: locked&&!isOrg?'not-allowed':'pointer', zIndex:3, fontSize:32, textAlign:'center', background:'none', border:'none', WebkitAppearance:'none' }}/>}
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
            <Kit team={teamName(fx.away)} size={24} flip />
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

