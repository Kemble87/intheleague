import { useState, useEffect } from 'react'

export default function PoolIntro({ pool, poolId }) {
  const key = 'intro-' + poolId
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem(key) } catch (e) { return false }
  })
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!show) return
    try { sessionStorage.setItem(key, '1') } catch (e) {}
    const t1 = setTimeout(() => setLeaving(true), 1150)
    const t2 = setTimeout(() => setShow(false), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [show, key])

  if (!show || !pool?.name) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100000,
      background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: leaving ? 0 : 1,
      transition: 'opacity .35s ease',
      pointerEvents: leaving ? 'none' : 'auto',
    }}>
      <style>{`
        @keyframes introName { 0% { opacity: 0; transform: scale(1.35); letter-spacing: .2em; filter: blur(6px); } 55% { opacity: 1; transform: scale(1); letter-spacing: -.03em; filter: blur(0); } 100% { opacity: 1; transform: scale(1); letter-spacing: -.03em; } }
        @keyframes introLine { 0% { transform: scaleX(0); } 45% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        @keyframes introEyebrow { 0%, 40% { opacity: 0; transform: translateY(6px); } 70% { opacity: 1; transform: translateY(0); } 100% { opacity: 1; } }
        @keyframes introSweep { 0% { transform: translateX(-130%) skewX(-18deg); } 60% { transform: translateX(-130%) skewX(-18deg); } 100% { transform: translateX(230%) skewX(-18deg); } }
        @media (prefers-reduced-motion: reduce) { .pi-anim { animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important; } }
      `}</style>

      <div className="pi-anim" style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,.4)', marginBottom: 16,
        animation: 'introEyebrow 1.1s ease both',
      }}>
        Season 2026/27
      </div>

      <div style={{ position: 'relative', overflow: 'hidden', padding: '4px 12px' }}>
        <div className="pi-anim" style={{
          fontFamily: "'Space Grotesk','Inter',sans-serif",
          fontSize: 'clamp(40px, 11vw, 72px)',
          fontWeight: 700, color: '#fff', lineHeight: 1, textAlign: 'center',
          animation: 'introName .85s cubic-bezier(.2,.9,.3,1) both',
        }}>
          {pool.name}
        </div>
        {/* floodlight sweep across the name */}
        <div className="pi-anim" style={{
          position: 'absolute', top: 0, bottom: 0, width: '38%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent)',
          animation: 'introSweep 1.25s ease both', pointerEvents: 'none',
        }}/>
      </div>

      <div className="pi-anim" style={{
        width: 120, height: 2, marginTop: 22, borderRadius: 99,
        background: 'linear-gradient(90deg, transparent, #00E05A, transparent)',
        boxShadow: '0 0 18px rgba(0,224,90,.5)',
        transformOrigin: 'center',
        animation: 'introLine 1.05s ease both',
      }}/>
    </div>
  )
}
