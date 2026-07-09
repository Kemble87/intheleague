import { useEffect, useState } from 'react'

const P = Array.from({ length: 14 }, (_, i) => ({
  a: (i / 14) * 360,
  d: 46 + (i % 4) * 16,
  s: i % 3 ? 5 : 7,
  c: i % 3 === 0 ? '#FFD60A' : '#00E05A',
  t: (i % 5) * 40,
}))

export default function ExactBurst({ id, active }) {
  const [fire, setFire] = useState(false)

  useEffect(() => {
    if (!active) return
    const k = 'exact-' + id
    try {
      if (localStorage.getItem(k)) return
      localStorage.setItem(k, '1')
    } catch (e) { return }
    setFire(true)
    const t = setTimeout(() => setFire(false), 1700)
    return () => clearTimeout(t)
  }, [active, id])

  if (!fire) return null

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
      <style>{`
        .fx { position: relative; }
        @keyframes ebGlow { 0% { opacity: 0; } 25% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes ebPart { 0% { transform: translate(-50%,-50%) rotate(var(--a)) translateX(0) scale(1); opacity: 1; } 100% { transform: translate(-50%,-50%) rotate(var(--a)) translateX(var(--d)) scale(.4); opacity: 0; } }
        @keyframes ebStamp { 0% { opacity: 0; transform: translate(-50%,-50%) scale(1.6) rotate(-8deg); } 35% { opacity: 1; transform: translate(-50%,-50%) scale(1) rotate(-4deg); } 75% { opacity: 1; } 100% { opacity: 0; transform: translate(-50%,-50%) scale(1) rotate(-4deg); } }
        @media (prefers-reduced-motion: reduce) { .eb-anim { animation: none !important; opacity: 0 !important; } }
      `}</style>
      <div className="eb-anim" style={{ position: 'absolute', inset: 0, borderRadius: 12, boxShadow: 'inset 0 0 40px rgba(0,224,90,.35), 0 0 30px rgba(0,224,90,.25)', animation: 'ebGlow 1.6s ease both' }}/>
      {P.map((p, i) => (
        <span key={i} className="eb-anim" style={{ position: 'absolute', left: '50%', top: '50%', width: p.s, height: p.s, borderRadius: i % 2 ? '50%' : 2, background: p.c, '--a': p.a + 'deg', '--d': p.d + 'px', animation: `ebPart .9s cubic-bezier(.2,.8,.4,1) ${p.t}ms both` }}/>
      ))}
      <div className="eb-anim" style={{ position: 'absolute', left: '50%', top: '50%', fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: '.06em', color: '#00E05A', textShadow: '0 0 20px rgba(0,224,90,.8)', animation: 'ebStamp 1.6s ease both', whiteSpace: 'nowrap' }}>+3 EXACT</div>
    </div>
  )
}
