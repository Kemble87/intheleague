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
