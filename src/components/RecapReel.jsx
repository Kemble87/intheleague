import { useState, useEffect, useRef } from 'react'

// ── The Matchday Recap Reel ──
// A self-playing animated sequence built from real pool data.
// Scenes: floodlights → headline → exact burst → table swing → chip drama → endcard
// ~10s total. Renders on a fixed 9:16 stage, scaled to fit.

const GREEN = '#00E05A'
const GOLD = '#FFD60A'
const RED = '#FF3B5C'
const BLUE = '#4499FF'
const DISP = "'Space Grotesk','Inter',sans-serif"
const MONO = "'Share Tech Mono',ui-monospace,monospace"

const SCENES = { flood: 0, headline: 1400, exact: 3500, table: 5500, chip: 7500, endcard: 9000, end: 10800 }

export default function RecapReel({ data, onClose }) {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const raf = useRef(0)
  const start = useRef(0)

  useEffect(() => {
    if (!playing) return
    start.current = performance.now() - t
    const loop = now => {
      const elapsed = now - start.current
      setT(elapsed)
      if (elapsed < SCENES.end) raf.current = requestAnimationFrame(loop)
      else setPlaying(false)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [playing])

  function replay() { setT(0); setPlaying(true) }

  const d = data || DEMO

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'relative', width: 'min(92vw, 46vh)', aspectRatio: '9/16', background: '#000', borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.8)' }}>
        <Stage t={t} d={d} />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button onClick={replay} style={ctrlBtn}>↻ Replay</button>
        <button onClick={onClose} style={{ ...ctrlBtn, background: 'none', color: '#888', border: '1px solid #333' }}>Close</button>
      </div>
      <div style={{ color: '#555', fontSize: 12, marginTop: 14, fontFamily: MONO, letterSpacing: '.1em' }}>
        MP4 EXPORT COMING NEXT — THIS IS THE ANIMATION
      </div>
    </div>
  )
}

const ctrlBtn = { padding: '11px 22px', background: GREEN, color: '#000', border: 'none', borderRadius: 500, font: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer' }

function Stage({ t, d }) {
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: DISP }}>
      <Floodlights t={t} name={d.poolName} />
      <Headline t={t} winner={d.winner} md={d.md} />
      <ExactScene t={t} exact={d.exact} winner={d.winner} />
      <TableScene t={t} table={d.table} />
      <ChipScene t={t} chip={d.chip} />
      <Endcard t={t} />
    </div>
  )
}

const prog = (t, from, to) => Math.max(0, Math.min(1, (t - from) / (to - from)))
const easeOut = x => 1 - Math.pow(1 - x, 3)
const easeInOut = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2

function Floodlights({ t, name }) {
  const visible = t < SCENES.headline + 200
  if (!visible) return null
  const fade = t > SCENES.headline ? 1 - prog(t, SCENES.headline, SCENES.headline + 200) : 1
  const pylons = [0, 1, 2, 3].map(i => prog(t, 200 + i * 220, 200 + i * 220 + 300))
  const flare = prog(t, 1000, 1300) * (1 - prog(t, 1300, 1500))

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fade, background: '#000' }}>
      <svg viewBox="0 0 300 533" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path d="M-30 360 A180 120 0 0 1 330 360" fill="none" stroke="#111" strokeWidth="2" />
        <path d="M60 420 A90 60 0 0 1 240 420" fill="none" stroke="#0d0d0d" strokeWidth="2" />
        {[42, 114, 186, 258].map((cx, i) => (
          <g key={cx}>
            {pylons[i] > 0 && (
              <polygon points={`${cx},130 ${cx - 60},533 ${cx + 60},533`} fill={GREEN} opacity={0.06 * pylons[i]} />
            )}
            <line x1={cx} y1={140} x2={cx} y2={250} stroke="#1a1a1a" strokeWidth="3" />
            <rect x={cx - 22} y={112} width={44} height={26} rx={3} fill="#141414" stroke="#222" />
            {[0, 1, 2, 3].map(c => [0, 1].map(r => {
              const v = Math.round(60 + 195 * pylons[i])
              return <circle key={`${c}-${r}`} cx={cx - 15 + c * 10} cy={119 + r * 12} r={2.6}
                fill={pylons[i] > 0 ? `rgb(${v},${v},${Math.round(v * 0.92)})` : '#2a2a2a'} />
            }))}
            {pylons[i] > 0.4 && (
              <circle cx={cx} cy={125} r={30} fill="#eafff2" opacity={0.25 * pylons[i]} style={{ filter: 'blur(12px)' }} />
            )}
          </g>
        ))}
      </svg>
      <div style={{ position: 'absolute', top: '46%', left: 0, right: 0, textAlign: 'center', opacity: prog(t, 600, 1000) * (1 - prog(t, 1000, 1200)) }}>
        <div style={{ fontFamily: MONO, fontSize: 'clamp(9px,2.6vw,13px)', letterSpacing: '.3em', color: '#666' }}>{(name || 'YOUR LEAGUE').toUpperCase()}</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: '#eafff2', opacity: flare * 0.9, pointerEvents: 'none' }} />
    </div>
  )
}
function Headline({ t, winner, md }) {
  if (t < SCENES.headline || t > SCENES.exact + 200) return null
  const local = t - SCENES.headline
  const out = prog(t, SCENES.exact, SCENES.exact + 200)
  const name = (winner || 'ROB').toUpperCase()
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '0 7%', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 1 - out, transform: `translateX(${out * -20}px)` }}>
      <div style={{ fontFamily: MONO, fontSize: 'clamp(9px,2.6vw,13px)', letterSpacing: '.24em', color: '#666', marginBottom: '3%', opacity: prog(local, 100, 400) }}>MATCHDAY {md ?? 7}</div>
      {[name, 'TAKES', 'THE CROWN'].map((w, i) => {
        const wp = easeOut(prog(local, i * 130, i * 130 + 380))
        const isCrown = i === 2
        return (
          <div key={i} style={{
            fontFamily: DISP, fontWeight: 800,
            fontSize: isCrown ? 'clamp(28px,10vw,52px)' : 'clamp(36px,13vw,68px)',
            color: isCrown ? GOLD : '#fff', lineHeight: 0.98, letterSpacing: '-.02em',
            opacity: wp, transform: `translateY(${(1 - wp) * 24}px)`,
          }}>{w}</div>
        )
      })}
      <div style={{ width: '26%', height: 4, borderRadius: 2, background: GREEN, marginTop: '4%', opacity: prog(local, 500, 800) }} />
    </div>
  )
}

function ExactScene({ t, exact, winner }) {
  if (t < SCENES.exact || t > SCENES.table + 200) return null
  const local = t - SCENES.exact
  const inP = easeOut(prog(local, 0, 350))
  const out = prog(t, SCENES.table, SCENES.table + 200)
  const burst = prog(local, 300, 700)
  if (!exact) return null
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '0 7%', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: (1 - out) * inP }}>
      <div style={{ fontFamily: MONO, fontSize: 'clamp(9px,2.6vw,13px)', letterSpacing: '.2em', color: '#666', marginBottom: '4%' }}>EXACT SCORE · +3</div>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4%', background: '#050505', border: '2px solid #1a1a1a', borderRadius: 12, padding: '6% 4%', alignSelf: 'flex-start' }}>
        <span style={{ fontFamily: MONO, fontSize: 'clamp(12px,3.4vw,18px)', color: '#777' }}>{abbr(exact.home)}</span>
        <span style={{ fontFamily: MONO, fontSize: 'clamp(30px,9vw,46px)', color: GREEN, textShadow: `0 0 ${8 + burst * 10}px #00ff44` }}>{exact.h}:{exact.a}</span>
        <span style={{ fontFamily: MONO, fontSize: 'clamp(12px,3.4vw,18px)', color: '#777' }}>{abbr(exact.away)}</span>
        {burst > 0 && [...Array(10)].map((_, i) => {
          const a = i * 36
          const r = 30 + burst * 60
          return <span key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: 5, height: 5, borderRadius: '50%', background: i % 3 ? GREEN : GOLD, opacity: 1 - burst, transform: `translate(${Math.cos(a * Math.PI / 180) * r}px, ${Math.sin(a * Math.PI / 180) * r}px)` }} />
        })}
      </div>
      <div style={{ fontSize: 'clamp(11px,3vw,15px)', color: '#888', marginTop: '5%' }}>{(winner || 'Rob')} called it. Nobody else did.</div>
    </div>
  )
}

function TableScene({ t, table }) {
  if (t < SCENES.table || t > SCENES.chip + 200) return null
  const local = t - SCENES.table
  const out = prog(t, SCENES.chip, SCENES.chip + 200)
  const rows = (table || []).slice(0, 4)
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '0 7%', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 1 - out }}>
      <div style={{ fontFamily: MONO, fontSize: 'clamp(9px,2.6vw,13px)', letterSpacing: '.2em', color: '#666', marginBottom: '5%' }}>AS IT STANDS</div>
      {rows.map((r, i) => {
        const rp = easeOut(prog(local, i * 140, i * 140 + 450))
        const colors = [GOLD, '#C0C0C0', '#CD7F32', '#555']
        const col = colors[i] || '#555'
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4%', padding: '3.5% 4%', marginBottom: '2.5%', background: i === 0 ? '#141003' : '#0d0d0d', border: `1px solid ${i === 0 ? GOLD + '55' : '#1a1a1a'}`, borderRadius: 10, opacity: rp, transform: `translateX(${(1 - rp) * 30}px)` }}>
            <span style={{ fontFamily: DISP, fontSize: 'clamp(13px,3.6vw,18px)', fontWeight: 700, color: col, width: '8%' }}>{i + 1}</span>
            <span style={{ fontFamily: DISP, fontSize: 'clamp(13px,3.6vw,18px)', fontWeight: 600, color: '#ddd', flex: 1 }}>{r.name}</span>
            {r.move ? <span style={{ fontSize: 'clamp(10px,2.8vw,13px)', fontWeight: 700, color: r.move > 0 ? GREEN : RED }}>{r.move > 0 ? '▲' : '▼'}{Math.abs(r.move)}</span> : null}
            <span style={{ fontFamily: DISP, fontSize: 'clamp(14px,4vw,20px)', fontWeight: 700, color: i === 0 ? col : '#999' }}>{r.pts}</span>
          </div>
        )
      })}
    </div>
  )
}

function ChipScene({ t, chip }) {
  if (t < SCENES.chip || t > SCENES.endcard + 200) return null
  const local = t - SCENES.chip
  const inP = easeOut(prog(local, 0, 350))
  const out = prog(t, SCENES.endcard, SCENES.endcard + 200)
  if (!chip) return null
  const won = chip.pts > 0
  return (
    <div style={{ position: 'absolute', inset: 0, padding: '0 7%', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: (1 - out) * inP, transform: `translateY(${(1 - inP) * 20}px)` }}>
      <div style={{ fontFamily: MONO, fontSize: 'clamp(9px,2.6vw,13px)', letterSpacing: '.2em', color: '#666', marginBottom: '4%' }}>CHIP WATCH</div>
      <div style={{ fontFamily: DISP, fontSize: 'clamp(24px,7vw,38px)', fontWeight: 800, color: '#fff', lineHeight: 1.05 }}>{chip.who} played</div>
      <div style={{ fontFamily: DISP, fontSize: 'clamp(24px,7vw,38px)', fontWeight: 800, color: BLUE, lineHeight: 1.05 }}>{chip.name}</div>
      <div style={{ fontFamily: DISP, fontSize: 'clamp(22px,6.5vw,34px)', fontWeight: 800, color: won ? GREEN : RED, marginTop: '4%' }}>{won ? `+${chip.pts} — nailed it.` : 'It backfired.'}</div>
    </div>
  )
}

function Endcard({ t }) {
  if (t < SCENES.endcard) return null
  const local = t - SCENES.endcard
  const inP = easeOut(prog(local, 0, 500))
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: inP, background: '#000' }}>
      <div style={{ fontFamily: DISP, fontSize: 'clamp(22px,7vw,34px)', fontWeight: 900, letterSpacing: '-.03em', transform: `scale(${0.9 + inP * 0.1})` }}>
        <span style={{ color: '#fff' }}>In</span><span style={{ color: GREEN }}>The</span><span style={{ color: '#fff' }}>League</span>
      </div>
      <div style={{ width: '30%', height: 3, background: GREEN, borderRadius: 2, margin: '5% 0' }} />
      <div style={{ fontFamily: DISP, fontSize: 'clamp(14px,4vw,20px)', fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>Beat your mates.<br />All season long.</div>
      <div style={{ marginTop: '7%', padding: '3% 7%', background: GREEN, borderRadius: 500, fontFamily: DISP, fontSize: 'clamp(11px,3vw,15px)', fontWeight: 800, color: '#000' }}>intheleague.app</div>
    </div>
  )
}

function abbr(name) {
  if (!name) return '?'
  return name.replace(/^(AFC|FC)\s+/i, '').trim().slice(0, 3).toUpperCase()
}

const DEMO = {
  poolName: 'The Lads', md: 7, winner: 'Rob',
  exact: { home: 'Man City', away: 'Chelsea', h: 2, a: 1 },
  table: [
    { name: 'Rob', pts: 42, move: 1 },
    { name: 'Dave', pts: 38, move: -1 },
    { name: 'Lee', pts: 31, move: 0 },
    { name: 'Sam', pts: 24, move: 0 },
  ],
  chip: { who: 'Lee', name: 'the Banker', pts: 0 },
}
