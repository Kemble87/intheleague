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
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px',