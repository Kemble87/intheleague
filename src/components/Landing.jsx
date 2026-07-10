import { useState, useEffect, useRef } from 'react'
import Backdrop from './Backdrop'

// ── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); obs.disconnect() }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, shown]
}

function Reveal({ children, delay = 0 }) {
  const [ref, shown] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity .7s ${delay}s cubic-bezier(.22,1,.36,1), transform .7s ${delay}s cubic-bezier(.22,1,.36,1)`,
    }}>{children}</div>
  )
}

// ── LCD digit ────────────────────────────────────────────────────────────────
function LcdDigit({ value, color = '#00ff66' }) {
  return (
    <div style={{
      width: 'clamp(38px,9vw,52px)', height: 'clamp(48px,11vw,64px)',
      background: '#060606', border: '1.5px solid #1a1a1a', borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0px,rgba(0,0,0,.12) 1px,transparent 1px,transparent 3px)', zIndex: 1 }}/>
      <span style={{
        fontFamily: "'Share Tech Mono',ui-monospace,monospace",
        fontSize: 'clamp(26px,6vw,36px)', color, lineHeight: 1,
        textShadow: `0 0 10px ${color}88`, position: 'relative', zIndex: 2,
        transition: 'all .2s',
      }}>{value}</span>
    </div>
  )
}

// ── Mini kit ─────────────────────────────────────────────────────────────────
function MiniKit({ primary, secondary, stripes, sleeves, flip }) {
  return (
    <svg width="30" height="33" viewBox="0 0 40 44" style={{ flexShrink: 0, transform: flip ? 'scaleX(-1)' : 'none' }}>
      <path d="M8,12 L2,18 L8,22 L8,40 L32,40 L32,22 L38,18 L32,12 L28,8 Q22,14 12,8 Z" fill={primary} stroke="rgba(0,0,0,.3)" strokeWidth=".5"/>
      {stripes && <><rect x="14" y="8" width="5" height="32" fill={secondary}/><rect x="23" y="8" width="5" height="32" fill={secondary}/></>}
      {sleeves && <><path d="M2,18 L8,12 L8,22 Z" fill={sleeves}/><path d="M38,18 L32,12 L32,22 Z" fill={sleeves}/></>}
      <path d="M16,8 Q20,12 24,8" fill="none" stroke={sleeves || secondary || '#fff'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ── Real chip badges (matching in-app artwork) ───────────────────────────────
function Badge2xL() {
  return (
    <svg viewBox="0 0 170 190" style={{ width:'100%', height:'auto', display:'block' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#1A0305" stroke="#8B0000" strokeWidth="1.5"/>
      <polygon points="85,16 150,53 150,129 85,166 20,129 20,53" fill="none" stroke="#CC0000" strokeWidth="0.5" opacity="0.5"/>
      <line x1="20" y1="60" x2="60" y2="100" stroke="#2a0000" strokeWidth="10" opacity="0.6"/>
      <line x1="40" y1="50" x2="90" y2="100" stroke="#2a0000" strokeWidth="10" opacity="0.6"/>
      <line x1="65" y1="45" x2="130" y2="110" stroke="#2a0000" strokeWidth="10" opacity="0.6"/>
      <text x="85" y="115" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="48" fontWeight="900" fill="#FFD700" letterSpacing="-2">2×</text>
      <line x1="32" y1="130" x2="138" y2="130" stroke="#FFD700" strokeWidth="0.8" opacity="0.5"/>
      <text x="85" y="145" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="9" fontWeight="700" fill="#FFD700" letterSpacing="3">MULTIPLIER</text>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#CC0000" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#FFD700" opacity="0.6"/><circle cx="85" cy="164" r="3" fill="#FFD700" opacity="0.6"/>
    </svg>
  )
}
function BadgeBankerL() {
  return (
    <svg viewBox="0 0 170 190" style={{ width:'100%', height:'auto', display:'block' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#020818" stroke="#002244" strokeWidth="1.5"/>
      <rect x="38" y="62" width="94" height="80" rx="4" fill="#001133" stroke="#0044AA" strokeWidth="1.5"/>
      {[44,57,70,83,96,109].map((x,i) => <line key={i} x1={x} y1="68" x2={x} y2="136" stroke="#FFD700" strokeWidth="2.5" opacity="0.7"/>)}
      <line x1="38" y1="84" x2="132" y2="84" stroke="#FFD700" strokeWidth="1.5" opacity="0.4"/>
      <line x1="38" y1="120" x2="132" y2="120" stroke="#FFD700" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="85" cy="96" r="14" fill="#002255" stroke="#0055CC" strokeWidth="1.5"/>
      <circle cx="85" cy="96" r="3" fill="#FFD700"/>
      <rect x="44" y="68" width="41" height="68" rx="2" fill="#002255" stroke="#0055CC" strokeWidth="1"/>
      <text x="85" y="151" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="9" fontWeight="700" fill="#FFD700" letterSpacing="4">BANKER</text>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#0055CC" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#FFD700" opacity="0.6"/><circle cx="85" cy="164" r="3" fill="#FFD700" opacity="0.6"/>
    </svg>
  )
}
function BadgeHthL() {
  return (
    <svg viewBox="0 0 170 190" style={{ width:'100%', height:'auto', display:'block' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#080418" stroke="#330066" strokeWidth="1.5"/>
      <polygon points="92,54 71,100 83,100 70,136 99,90 85,90 98,54" fill="#9966FF"/>
      <polygon points="92,54 71,100 83,100 70,136 99,90 85,90 98,54" fill="none" stroke="#C0C0C0" strokeWidth="0.8" opacity="0.6"/>
      <text x="22" y="80" fontSize="11" fill="#C0C0C0" opacity="0.4">★</text>
      <text x="138" y="80" fontSize="11" fill="#C0C0C0" opacity="0.4">★</text>
      <text x="85" y="147" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="8" fontWeight="700" fill="#C0C0C0" letterSpacing="3">HALF TIME</text>
      <text x="85" y="159" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="8" fontWeight="700" fill="#C0C0C0" letterSpacing="5">HERO</text>
      <text x="85" y="52" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#9966FF" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#C0C0C0" opacity="0.5"/><circle cx="85" cy="164" r="3" fill="#C0C0C0" opacity="0.5"/>
    </svg>
  )
}
function BadgeCopycatL() {
  return (
    <svg viewBox="0 0 170 190" style={{ width:'100%', height:'auto', display:'block' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#020E14" stroke="#003344" strokeWidth="1.5"/>
      <circle cx="82" cy="96" r="30" fill="none" stroke="#00AACC" strokeWidth="3"/>
      <circle cx="82" cy="96" r="24" fill="#001A20" stroke="#004455" strokeWidth="1"/>
      <polygon points="72,82 76,70 80,82" fill="#007799"/>
      <polygon points="84,82 88,70 92,82" fill="#007799"/>
      <ellipse cx="76" cy="95" rx="5" ry="6" fill="#00DDFF"/><ellipse cx="88" cy="95" rx="5" ry="6" fill="#00DDFF"/>
      <ellipse cx="76" cy="95" rx="1.5" ry="5.5" fill="#001014"/><ellipse cx="88" cy="95" rx="1.5" ry="5.5" fill="#001014"/>
      <path d="M78,105 Q82,110 86,105" fill="none" stroke="#00AACC" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="104" y1="118" x2="122" y2="136" stroke="#00AACC" strokeWidth="5" strokeLinecap="round"/>
      <text x="85" y="149" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="9" fontWeight="700" fill="#00CCDD" letterSpacing="4">COPYCAT</text>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#00AACC" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#00CCDD" opacity="0.6"/><circle cx="85" cy="164" r="3" fill="#00CCDD" opacity="0.6"/>
    </svg>
  )
}
function BadgeCouponL() {
  return (
    <svg viewBox="0 0 170 190" style={{ width:'100%', height:'auto', display:'block' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#0a1a0a" stroke="#1a6b1a" strokeWidth="1.5"/>
      <rect x="32" y="54" width="106" height="88" rx="3" fill="#f5f0e8" opacity="0.92"/>
      <rect x="32" y="54" width="106" height="18" rx="3" fill="#1a6b1a"/>
      <rect x="32" y="66" width="106" height="6" fill="#1a6b1a"/>
      <text x="85" y="66" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="900" fill="#fff">COUPON</text>
      <line x1="36" y1="82" x2="134" y2="82" stroke="#ccc" strokeWidth="0.5" strokeDasharray="2 2"/>
      <line x1="36" y1="96" x2="134" y2="96" stroke="#ccc" strokeWidth="0.5" strokeDasharray="2 2"/>
      <line x1="36" y1="110" x2="134" y2="110" stroke="#ccc" strokeWidth="0.5" strokeDasharray="2 2"/>
      <rect x="36" y="85" width="60" height="7" rx="1" fill="#ddd" opacity="0.6"/>
      <rect x="36" y="99" width="50" height="7" rx="1" fill="#ddd" opacity="0.6"/>
      <rect x="36" y="113" width="55" height="7" rx="1" fill="#ddd" opacity="0.6"/>
      <g transform="rotate(-8, 85, 95)">
        <rect x="48" y="82" width="74" height="22" rx="2" fill="none" stroke="#1a6b1a" strokeWidth="2.5"/>
        <text x="85" y="97" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="14" fontWeight="900" fill="#1a6b1a" letterSpacing=".08em">SAVED</text>
      </g>
      <text x="85" y="158" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="8" fontWeight="700" fill="#4CAF50" letterSpacing="2">COUPON BUSTER</text>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#2d8b2d" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#4CAF50" opacity="0.6"/><circle cx="85" cy="164" r="3" fill="#4CAF50" opacity="0.6"/>
    </svg>
  )
}

function HexChip({ Badge, sub, color, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      width: 'clamp(100px,24vw,140px)',
      transform: active ? 'scale(1.08) translateY(-6px)' : 'scale(1)',
      transition: 'transform .25s cubic-bezier(.22,1,.36,1), filter .25s',
      filter: active ? `drop-shadow(0 12px 32px ${color}55)` : 'drop-shadow(0 8px 24px rgba(0,0,0,.6))',
    }}>
      <Badge/>
      <div style={{ fontSize: 11, color: active ? '#999' : '#555', marginTop: 10, lineHeight: 1.45, textAlign: 'center', transition: 'color .25s' }}>{sub}</div>
    </button>
  )
}

// ── Countdown ────────────────────────────────────────────────────────────────
function Countdown() {
  const kickoff = new Date('2026-08-21T19:00:00Z')
  const [t, setT] = useState(kickoff - Date.now())
  useEffect(() => {
    const iv = setInterval(() => setT(kickoff - Date.now()), 1000)
    return () => clearInterval(iv)
  }, [])
  if (t <= 0) return null
  const d = Math.floor(t / 864e5)
  const h = Math.floor((t % 864e5) / 36e5)
  const m = Math.floor((t % 36e5) / 6e4)
  const s = Math.floor((t % 6e4) / 1000)
  const seg = (v, l) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 'clamp(28px,7vw,44px)', color: '#ff6600', textShadow: '0 0 12px #ff440066', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em', color: '#444', marginTop: 6, textTransform: 'uppercase' }}>{l}</div>
    </div>
  )
  return (
    <div style={{ display: 'flex', gap: 'clamp(16px,4vw,32px)', justifyContent: 'center' }}>
      {seg(d, 'days')}{seg(h, 'hours')}{seg(m, 'mins')}{seg(s, 'secs')}
    </div>
  )
}

// ── FAQ item ─────────────────────────────────────────────────────────────────
function Faq({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #111' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{q}</span>
        <span style={{ color: '#00E05A', fontSize: 20, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>+</span>
      </button>
      {open && <div style={{ fontSize: 14, color: '#777', lineHeight: 1.6, paddingBottom: 18 }}>{a}</div>}
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function Landing({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)
  const [demoH, setDemoH] = useState('2')
  const [demoA, setDemoA] = useState('1')
  const [activeChip, setActiveChip] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cycle hero LCD digits
  useEffect(() => {
    const scores = [['2','1'],['3','0'],['1','1'],['2','2'],['4','1']]
    let i = 0
    const iv = setInterval(() => {
      i = (i + 1) % scores.length
      setDemoH(scores[i][0]); setDemoA(scores[i][1])
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  const CHIPS = [
    { id: '2x',     Badge: Badge2xL,      color: '#FFD700', sub: 'Double every point for one matchday.' },
    { id: 'banker', Badge: BadgeBankerL,  color: '#4499FF', sub: 'Triple points on your surest pick.' },
    { id: 'hth',    Badge: BadgeHthL,     color: '#9966FF', sub: 'Change your picks at half time.' },
    { id: 'cat',    Badge: BadgeCopycatL, color: '#00CCDD', sub: "Steal a rival's picks. Silently." },
    { id: 'coupon', Badge: BadgeCouponL,  color: '#4CAF50', sub: 'Your worst result — rescued.' },
  ]

  const green = '#00E05A'
  const sectionPad = 'clamp(64px,12vw,120px) 20px'
  const h2Style = { fontFamily: "'Space Grotesk','Inter',sans-serif", fontWeight: 700, fontSize: 'clamp(32px,7vw,56px)', letterSpacing: '-.03em', lineHeight: 1.02, color: '#fff', margin: 0 }
  const subStyle = { fontSize: 'clamp(14px,3vw,17px)', color: '#666', lineHeight: 1.6, marginTop: 16, maxWidth: 480 }
  const ctaStyle = {
    padding: '16px 36px', background: green, color: '#000', border: 'none', borderRadius: 500,
    font: 'inherit', fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: '-.01em',
    transition: 'transform .15s, box-shadow .15s',
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden', position: 'relative' }}>
      <Backdrop />
      <style>{`
        @keyframes floatPhone { 0%,100% { transform: rotate(-4deg) translateY(0); } 50% { transform: rotate(-4deg) translateY(-14px); } }
        @keyframes pulseGlow { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        .cta-btn:hover { transform: scale(1.04); box-shadow: 0 8px 40px #00E05A55; }
        .cta-btn:active { transform: scale(.98); }
      `}</style>

