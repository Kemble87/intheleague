// Cinematic stadium-night ambience — fixed layer behind all app content.
// Pure CSS/SVG: pitch geometry, breathing floodlights, drifting particles.
export default function Backdrop() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    left: (i * 7.3 + 4) % 100,
    size: 1.5 + (i % 3),
    dur: 22 + (i % 7) * 6,
    delay: -(i * 3.7),
    op: 0.05 + (i % 4) * 0.02,
  }))

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <style>{`
        @keyframes bdFlood { 0%,100% { opacity: .5; } 50% { opacity: 1; } }
        @keyframes bdFloodB { 0%,100% { opacity: .9; } 50% { opacity: .4; } }
        @keyframes bdDrift {
          0%   { transform: translateY(12vh) translateX(0); opacity: 0; }
          12%  { opacity: var(--op); }
          88%  { opacity: var(--op); }
          100% { transform: translateY(-108vh) translateX(4vw); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bd-anim { animation: none !important; }
        }
      `}</style>

      {/* Floodlight — top left */}
      <div className="bd-anim" style={{
        position: 'absolute', top: '-28vh', left: '-24vw', width: '75vw', height: '80vh',
        background: 'radial-gradient(ellipse at 30% 20%, rgba(200,220,255,.05) 0%, rgba(200,220,255,.02) 40%, transparent 70%)',
        animation: 'bdFlood 14s ease-in-out infinite',
      }}/>
      {/* Floodlight — top right, offset rhythm */}
      <div className="bd-anim" style={{
        position: 'absolute', top: '-30vh', right: '-26vw', width: '75vw', height: '85vh',
        background: 'radial-gradient(ellipse at 70% 20%, rgba(200,220,255,.045) 0%, rgba(200,220,255,.018) 40%, transparent 70%)',
        animation: 'bdFloodB 19s ease-in-out infinite',
      }}/>
      {/* Green under-glow near the fold */}
      <div className="bd-anim" style={{
        position: 'absolute', bottom: '-45vh', left: '50%', transform: 'translateX(-50%)', width: '120vw', height: '80vh',
        background: 'radial-gradient(ellipse, rgba(0,224,90,.035) 0%, transparent 60%)',
        animation: 'bdFlood 23s ease-in-out infinite',
      }}/>

      {/* Pitch geometry — giant centre circle + halfway line, viewed from the gods */}
      <svg viewBox="0 0 1000 1400" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 'max(1100px, 130vw)', height: '100%', opacity: 1 }}>
        <g stroke="#ffffff" strokeOpacity="0.028" fill="none" strokeWidth="2">
          <line x1="-100" y1="430" x2="1100" y2="430"/>
          <circle cx="500" cy="430" r="230"/>
          <circle cx="500" cy="430" r="6" fill="#ffffff" fillOpacity="0.03" stroke="none"/>
          {/* Penalty box hint at the very bottom */}
          <rect x="230" y="1220" width="540" height="220" rx="2"/>
          <path d="M 355 1220 A 145 145 0 0 1 645 1220"/>
        </g>
      </svg>

      {/* Drifting atmosphere particles */}
      {particles.map((p, i) => (
        <div key={i} className="bd-anim" style={{
          position: 'absolute', bottom: 0, left: `${p.left}%`,
          width: p.size, height: p.size, borderRadius: '50%',
          background: '#cfe0ff',
          filter: 'blur(0.5px)',
          '--op': p.op,
          animation: `bdDrift ${p.dur}s linear ${p.delay}s infinite`,
          opacity: 0,
        }}/>
      ))}

      {/* Bottom vignette to keep content legible */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 120%, transparent 55%, rgba(0,0,0,.5) 100%)' }}/>
    </div>
  )
}
