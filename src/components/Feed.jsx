import { useState, useEffect } from 'react'
import { buildFeed, buildRecapData } from '../lib/feedEvents'
import RecapReel from './RecapReel'

const GREEN = '#00E05A'
const DISP = "'Space Grotesk','Inter',sans-serif"
const MONO = "'Share Tech Mono',ui-monospace,monospace"

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function Countdown({ target }) {
  const [, tick] = useState(0)
  useEffect(() => { const iv = setInterval(() => tick(t => t + 1), 1000); return () => clearInterval(iv) }, [])
  const t = target - Date.now()
  if (t <= 0) return <span style={{ color: GREEN }}>LIVE</span>
  const h = Math.floor(t / 3.6e6), m = Math.floor((t % 3.6e6) / 6e4), s = Math.floor((t % 6e4) / 1000)
  const d = Math.floor(h / 24)
  if (d >= 2) return <span>{d} days</span>
  const pad = n => String(n).padStart(2, '0')
  return <span>{pad(h)}:{pad(m)}:{pad(s)}</span>
}

export default function Feed({ pool, poolId, fixtures, results, allPicks, allChips, members, userId, onOpenGazette, onGoPicks }) {
  const events = buildFeed({ pool, poolId, fixtures, results, allPicks, allChips, members, userId })
  const [showReel, setShowReel] = useState(false)
  const recapData = buildRecapData({ pool, poolId, fixtures, results, allPicks, allChips, members, userId })

  if (!events.length) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: '#555' }}>
        <div style={{ fontFamily: DISP, fontSize: 17, fontWeight: 700, color: '#888', marginBottom: 8 }}>The season starts here</div>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>Once picks are in and games kick off, your league's story writes itself — crowns, exact scores, chip drama and the back page all land here.</div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 4 }}>
      {showReel && recapData && <RecapReel data={recapData} onClose={() => setShowReel(false)} />}
      {recapData && (
        <button onClick={() => setShowReel(true)} style={{ width: '100%', marginBottom: 24, padding: '16px 18px', background: 'linear-gradient(135deg,#0a1a0f,#0d0d0d)', border: '1px solid #00E05A55', borderRadius: 16, cursor: 'pointer', font: 'inherit', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
          <span style={{ width: 44, height: 44, borderRadius: '50%', background: '#00E05A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#000', fontSize: 18, marginLeft: 3 }}>▶</span>
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 16, fontWeight: 700, color: '#fff' }}>Your Matchday {recapData.md} recap</span>
            <span style={{ display: 'block', fontSize: 12.5, color: '#00E05A', marginTop: 2 }}>10-second highlight reel · tap to play</span>
          </span>
        </button>
      )}
      {events.map((e, i) => {
        // ── Pinned deadline: a statement, not a card ──
        if (e.type === 'deadline') {
          return (
            <div key={i} onClick={onGoPicks} style={{ cursor: 'pointer', padding: '4px 0 22px', borderBottom: '1px solid #141414', marginBottom: 22 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.18em', color: '#555', marginBottom: 8 }}>{e.kicker} IN</div>
              <div style={{ fontFamily: MONO, fontSize: 'clamp(40px,12vw,60px)', fontWeight: 700, color: GREEN, lineHeight: 1, letterSpacing: '.02em' }}>
                <Countdown target={e.lockTs} />
              </div>
              <div style={{ fontSize: 13, color: '#777', marginTop: 10 }}>{e.headline} · {e.sub}</div>
            </div>
          )
        }

        const accent = e.gold ? '#FFD60A' : GREEN
        return (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 26 }}>
            {/* timestamp rail */}
            <div style={{ width: 42, flexShrink: 0, fontFamily: MONO, fontSize: 12, color: '#3d3d3d', paddingTop: e.kicker ? 22 : 2, textAlign: 'right' }}>
              {timeAgo(e.ts)}
            </div>
            {/* content */}
            <div style={{ flex: 1, minWidth: 0, borderBottom: '1px solid #111', paddingBottom: 26, marginBottom: -26 }}>
              {e.gold && <div style={{ width: 44, height: 3, borderRadius: 2, background: '#FFD60A', marginBottom: 12 }} />}
              {e.kicker && <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.14em', color: e.gold ? '#FFD60A' : '#4a4a4a', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.kicker}</div>}
              <div style={{ fontFamily: DISP, fontSize: e.gold ? 26 : 21, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.1 }}>
                {e.headline}
              </div>

              {/* LCD chip for exact scores */}
              {e.lcd && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 10, background: '#050505', border: '1px solid #1a1a1a', borderRadius: 8, padding: '5px 10px' }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: '#666' }}>{abbr(e.lcd.home)}</span>
                  <span style={{ fontFamily: MONO, fontSize: 15, color: GREEN, textShadow: '0 0 6px #00ff4444' }}>{e.lcd.h}:{e.lcd.a}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: '#666' }}>{abbr(e.lcd.away)}</span>
                </div>
              )}

              {/* Gazette gets a tappable read link */}
              {e.type === 'gazette' ? (
                <button onClick={() => onOpenGazette?.(e.md)} style={{ display: 'block', marginTop: 8, background: 'none', border: 'none', padding: 0, color: GREEN, font: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                  {e.sub}
                </button>
              ) : e.sub ? (
                <div style={{ fontSize: 13.5, color: '#777', marginTop: 6, lineHeight: 1.5 }}>{e.sub}</div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function abbr(name) {
  if (!name) return '?'
  const clean = name.replace(/^(AFC|FC)\s+/i, '').trim()
  return clean.slice(0, 3).toUpperCase()
}
