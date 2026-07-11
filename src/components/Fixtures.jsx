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
          <span className="ntp-cd" style={t < 3600e3 ? { color: '#FF3B5C', animation: 'ntpUrgent 1.2s ease-in-out infinite' } : undefined}>
            {t < 3600e3 && <style>{`@keyframes ntpUrgent { 0%,100% { opacity: 1; } 50% { opacity: .45; } }`}</style>}
            locks in {cdStr}
          </span>
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
  const myPts = played.reduce((s, f) => { const p = calcPts(picks[f.id], results[f.id]); return p != null ? s + p : s }, 0)
  const myExact = played.filter(f => calcPts(picks[f.id], results[f.id]) === 3).length
  const myPicked = mxs.filter(f => picks[f.id]?.h != null).length
  // Pundit's verdict: all picks in for a specific upcoming matchday
  const upcoming = mxs.filter(f => new Date(f.kickoff).getTime() > Date.now())
  const allIn = matchday !== 'ALL' && upcoming.length > 0 && upcoming.every(f => picks[f.id]?.h != null && picks[f.id]?.a != null)
  let verdict = null
  if (allIn) {
    const ps = upcoming.map(f => picks[f.id])
    const homes = ps.filter(p => p.h > p.a).length, aways = ps.filter(p => p.a > p.h).length, draws = ps.length - homes - aways
    const goals = ps.reduce((s, p) => s + p.h + p.a, 0)
    const avg = goals / ps.length
    const seedV = (matchday + ':' + goals + ':' + homes).split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0)
    const vpick = arr => arr[seedV % arr.length]
    if (aways > homes) verdict = vpick(["Bold round: backing the away days. Fortune favours… well, we'll see.", 'An away-heavy coupon. Either genius or chaos — no in-between.'])
    else if (draws >= Math.max(2, Math.ceil(ps.length / 3))) verdict = vpick(['A draw specialist at work. The fence has never been so comfortable.', "All those draws… someone's playing the percentages."])
    else if (avg >= 3.2) verdict = vpick(["Goals, goals, goals — the entertainer's coupon. Defence optional.", "You're predicting fireworks. The neutrals thank you."])
    else if (avg <= 1.8) verdict = vpick(["Safe as houses. The accountant's coupon.", 'Low-scoring picks across the board — someone watched the tactics podcasts.'])
    else verdict = vpick(['A balanced hand. Sensible… suspiciously sensible.', 'Textbook picks. Now the football just has to cooperate.'])
  }
  if (!played.length && !verdict) return null
  let nh = 0, nd = 0, na = 0, total = 0
  played.forEach(f => {
    Object.values(allPicks || {}).forEach(mp => {
      const p = (mp || {})[f.id]
      if (p?.h != null && p?.a != null) { total++; if (p.h > p.a) nh++; else if (p.h === p.a) nd++; else na++ }
    })
  })
  return (
    <>
      {verdict && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#0d0d0d', border: '1px solid #1a1a1a', borderLeft: '2px solid #00E05A', borderRadius: '0 12px 12px 0', padding: '11px 14px', marginBottom: 10 }}>
          <span style={{ fontFamily: "'Share Tech Mono',ui-monospace,monospace", fontSize: 9, letterSpacing: '.14em', color: '#00E05A', paddingTop: 2, flexShrink: 0 }}>PUNDIT</span>
          <span style={{ fontSize: 12.5, color: '#999', lineHeight: 1.55, fontStyle: 'italic' }}>{verdict}</span>
        </div>
      )}
      {played.length > 0 && (
      <div className="md-summary">
        <div className="md-sum-stat"><div className="md-sum-num green">{myPts}</div><div className="md-sum-label">My pts</div></div>
        <div className="md-sum-stat"><div className="md-sum-num gold">{myExact}</div><div className="md-sum-label">Exact</div></div>
        <div className="md-sum-stat"><div className="md-sum-num">{myPicked}/{mxs.length}</div><div className="md-sum-label">Picked</div></div>
      </div>
      )}
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

