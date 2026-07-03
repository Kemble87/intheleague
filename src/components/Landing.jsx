import { useState, useEffect, useRef } from 'react'

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

// ── Hex chip badge (simplified for landing) ──────────────────────────────────
function HexChip({ label, sub, color, emoji, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      transform: active ? 'scale(1.08)' : 'scale(1)', transition: 'transform .25s cubic-bezier(.22,1,.36,1)',
      filter: active ? `drop-shadow(0 0 24px ${color}66)` : 'none',
    }}>
      <svg viewBox="0 0 170 190" style={{ width: 'clamp(90px,22vw,130px)', height: 'auto', display: 'block' }}>
        <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#0d0d0d" stroke={color} strokeWidth="1.5" opacity={active ? 1 : 0.85}/>
        <polygon points="85,16 150,53 150,129 85,166 20,129 20,53" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4"/>
        <text x="85" y="100" textAnchor="middle" fontSize="42">{emoji}</text>
        <text x="85" y="138" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="10" fontWeight="700" fill={color} letterSpacing="2">{label.toUpperCase()}</text>
        <circle cx="85" cy="18" r="3" fill={color} opacity="0.6"/>
        <circle cx="85" cy="164" r="3" fill={color} opacity="0.6"/>
      </svg>
      <div style={{ fontSize: 11, color: '#555', marginTop: 8, maxWidth: 130, lineHeight: 1.4, textAlign: 'center', margin: '8px auto 0' }}>{sub}</div>
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
        <span style={{ color: '#1DB954', fontSize: 20, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }}>+</span>
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
    { id: '2x',     emoji: '⚡', label: '2× Multiplier', color: '#FFD700', sub: 'Double every point for one matchday.' },
    { id: 'banker', emoji: '🏦', label: 'Banker',        color: '#4499FF', sub: 'Triple points on your surest pick.' },
    { id: 'hth',    emoji: '⏱', label: 'Half Time Hero', color: '#9966FF', sub: 'Change your picks at half time.' },
    { id: 'cat',    emoji: '🐱', label: 'Copycat',        color: '#00CCDD', sub: "Steal a rival's picks. Silently." },
    { id: 'coupon', emoji: '🎟', label: 'Coupon Buster',  color: '#4CAF50', sub: 'Your worst result — rescued.' },
  ]

  const green = '#1DB954'
  const sectionPad = 'clamp(64px,12vw,120px) 20px'
  const h2Style = { fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(40px,9vw,72px)', letterSpacing: '.02em', lineHeight: .95, color: '#fff', margin: 0 }
  const subStyle = { fontSize: 'clamp(14px,3vw,17px)', color: '#666', lineHeight: 1.6, marginTop: 16, maxWidth: 480 }
  const ctaStyle = {
    padding: '16px 36px', background: green, color: '#000', border: 'none', borderRadius: 500,
    font: 'inherit', fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: '-.01em',
    transition: 'transform .15s, box-shadow .15s',
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes floatPhone { 0%,100% { transform: rotate(-4deg) translateY(0); } 50% { transform: rotate(-4deg) translateY(-14px); } }
        @keyframes pulseGlow { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        .cta-btn:hover { transform: scale(1.04); box-shadow: 0 8px 40px #1DB95455; }
        .cta-btn:active { transform: scale(.98); }
      `}</style>

      {/* ── Sticky nav (appears on scroll) ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #111',
        transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform .3s ease',
      }}>
        <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.04em', color: '#fff' }}>In<em style={{ color: green, fontStyle: 'normal' }}>The</em>League</div>
        <button className="cta-btn" onClick={onGetStarted} style={{ ...ctaStyle, padding: '10px 22px', fontSize: 13 }}>Start free</button>
      </div>

      {/* ── 1. HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 60px', position: 'relative' }}>
        {/* Top nav */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.04em', color: '#fff' }}>In<em style={{ color: green, fontStyle: 'normal' }}>The</em>League</div>
          <button onClick={onGetStarted} style={{ background: 'none', border: '1px solid #222', borderRadius: 500, padding: '9px 20px', color: '#aaa', font: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Sign in</button>
        </div>

        {/* Glow */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, #1DB95415 0%, transparent 65%)', animation: 'pulseGlow 4s ease-in-out infinite', pointerEvents: 'none' }}/>

        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(56px,14vw,120px)', letterSpacing: '.01em', lineHeight: .92, color: '#fff', textAlign: 'center', margin: 0, position: 'relative' }}>
          Beat your mates.<br/><span style={{ color: green }}>All season long.</span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,3.5vw,19px)', color: '#888', textAlign: 'center', maxWidth: 440, lineHeight: 1.6, margin: '24px 0 32px', position: 'relative' }}>
          Private score prediction leagues for your group chat. Set up in 60 seconds — free.
        </p>
        <button className="cta-btn" onClick={onGetStarted} style={{ ...ctaStyle, position: 'relative' }}>Start your pool →</button>

        {/* Floating fixture card demo */}
        <div style={{ marginTop: 64, animation: 'floatPhone 5s ease-in-out infinite', maxWidth: 420, width: '100%', position: 'relative' }}>
          <div style={{ background: '#111', borderRadius: 18, padding: '14px 16px 16px', boxShadow: '0 40px 100px rgba(0,0,0,.9), 0 0 60px #1DB95411', border: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#444', fontFamily: "'Share Tech Mono',monospace", letterSpacing: '.08em', marginBottom: 12 }}>
              <span>SAT 22 AUG · 15:00</span>
              <span style={{ color: '#FFD60A', background: '#221f00', borderRadius: 500, padding: '2px 8px', fontSize: 9, fontWeight: 700 }}>🔒 2H 14M</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MiniKit primary="#EF0107" sleeves="#fff"/>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: '#fff', letterSpacing: '.05em' }}>Arsenal</div>
                  <div style={{ fontSize: 8, color: '#333', letterSpacing: '.12em', fontFamily: "'Share Tech Mono',monospace" }}>ARS</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>
                <LcdDigit value={demoH}/>
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 20, color: '#2a2a2a' }}>:</span>
                <LcdDigit value={demoA}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: '#fff', letterSpacing: '.05em' }}>Chelsea</div>
                  <div style={{ fontSize: 8, color: '#333', letterSpacing: '.12em', fontFamily: "'Share Tech Mono',monospace" }}>CHE</div>
                </div>
                <MiniKit primary="#034694" flip/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SOCIAL PROOF STRIP ── */}
      <div style={{ borderTop: '1px solid #0d0d0d', borderBottom: '1px solid #0d0d0d', padding: '18px 20px', display: 'flex', gap: 'clamp(20px,6vw,56px)', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['⚽ 380 fixtures synced live', '🏆 Built for the 2026/27 season', '🔒 Free to start — no card'].map(t => (
          <span key={t} style={{ fontSize: 12, fontWeight: 600, color: '#555', letterSpacing: '.04em' }}>{t}</span>
        ))}
      </div>

      {/* ── 3. HOW IT WORKS ── */}
      <section style={{ padding: sectionPad, maxWidth: 920, margin: '0 auto' }}>
        <Reveal>
          <h2 style={h2Style}>Sixty seconds<br/><span style={{ color: green }}>to kickoff.</span></h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginTop: 48 }}>
          {[
            { n: '01', t: 'Create a pool', d: 'Name it, pick your league. Premier League, Championship, World Cup — synced automatically.' },
            { n: '02', t: 'Share one link', d: 'Drop it in the group chat. Your mates tap, sign in, done. No apps to download.' },
            { n: '03', t: 'Talk trash all season', d: 'Everyone predicts scores. Points auto-calculate. The leaderboard settles every argument.' },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * .1}>
              <div style={{ background: '#0d0d0d', border: '1px solid #161616', borderRadius: 16, padding: '28px 24px', height: '100%' }}>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 13, color: green, marginBottom: 14 }}>{s.n}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-.02em' }}>{s.t}</div>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{s.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 4. CHIPS ── */}
      <section style={{ padding: sectionPad, background: 'radial-gradient(ellipse at 50% 0%, #0a1206 0%, #000 60%)' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <h2 style={h2Style}>Five chips.<br/><span style={{ color: green }}>One shot at glory.</span></h2>
            <p style={{ ...subStyle, margin: '16px auto 0' }}>
              Play them at the perfect moment — or waste them like Dave wasted his Banker on a nil-nil.
            </p>
          </Reveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(8px,3vw,24px)', justifyContent: 'center', marginTop: 56 }}>
            {CHIPS.map((c, i) => (
              <Reveal key={c.id} delay={i * .08}>
                <HexChip {...c} active={activeChip === c.id} onClick={() => setActiveChip(activeChip === c.id ? null : c.id)}/>
              </Reveal>
            ))}
          </div>
          <Reveal delay={.3}>
            <div style={{ fontSize: 12, color: '#444', marginTop: 40 }}>Each chip: one use per season. Cinematic activation included. Regret optional.</div>
          </Reveal>
        </div>
      </section>

      {/* ── 5. ORGANISER ── */}
      <section style={{ padding: sectionPad, maxWidth: 920, margin: '0 auto' }}>
        <Reveal>
          <h2 style={h2Style}>Run the league<br/><span style={{ color: green }}>without doing the maths.</span></h2>
          <p style={subStyle}>You're the commissioner. We handle everything else.</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginTop: 48 }}>
          {[
            { e: '👋', t: 'One-tap nudges', d: '"Dave hasn\'t picked yet" — tap Nudge, paste into WhatsApp, done. No more chasing on a Friday night.' },
            { e: '⚡', t: 'Auto-synced results', d: 'Real fixtures and results pulled live. Points calculate themselves. Zero spreadsheets.' },
            { e: '👑', t: 'Full admin control', d: 'Approve members, remove ghosts, transfer ownership when you retire from the role.' },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i * .1}>
              <div style={{ background: '#0d0d0d', border: '1px solid #161616', borderRadius: 16, padding: '28px 24px', height: '100%' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.e}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-.02em' }}>{f.t}</div>
                <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 6. PRICING ── */}
      <section style={{ padding: sectionPad, maxWidth: 780, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ ...h2Style, textAlign: 'center' }}>Free to start.<br/><span style={{ color: green }}>£14.99 to go legendary.</span></h2>
          <p style={{ ...subStyle, textAlign: 'center', margin: '16px auto 0' }}>Less than one round of pints. Lasts all season.</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginTop: 48 }}>
          <Reveal>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 20, padding: '32px 28px', height: '100%' }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#555', marginBottom: 8 }}>Free</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-.04em' }}>£0</div>
              <div style={{ fontSize: 12, color: '#444', marginBottom: 24 }}>forever</div>
              {['1 league', 'Up to 10 players', 'Live leaderboard', 'All 5 chips', 'Auto-synced fixtures'].map(f => (
                <div key={f} style={{ fontSize: 14, color: '#888', padding: '7px 0', display: 'flex', gap: 10 }}><span style={{ color: '#333' }}>✓</span>{f}</div>
              ))}
              <button className="cta-btn" onClick={onGetStarted} style={{ ...ctaStyle, width: '100%', marginTop: 24, background: '#1a1a1a', color: '#fff' }}>Start free</button>
            </div>
          </Reveal>
          <Reveal delay={.1}>
            <div style={{ background: 'linear-gradient(160deg,#07180d,#0d0d0d 60%)', border: `1.5px solid ${green}`, borderRadius: 20, padding: '32px 28px', position: 'relative', height: '100%', boxShadow: '0 20px 80px #1DB95418' }}>
              <div style={{ position: 'absolute', top: -11, right: 24, background: green, color: '#000', fontSize: 10, fontWeight: 900, letterSpacing: '.1em', padding: '4px 12px', borderRadius: 500 }}>SEASON PASS</div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: green, marginBottom: 8 }}>Pro Organiser</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-.04em' }}>£14.99</div>
              <div style={{ fontSize: 12, color: '#444', marginBottom: 24 }}>per season · one payment covers your whole pool</div>
              {['Everything in Free', 'Unlimited players', 'Custom scoring rules', 'Weekly email summaries', 'Export standings', 'Priority support'].map(f => (
                <div key={f} style={{ fontSize: 14, color: '#aaa', padding: '7px 0', display: 'flex', gap: 10 }}><span style={{ color: green }}>✓</span>{f}</div>
              ))}
              <button className="cta-btn" onClick={onGetStarted} style={{ ...ctaStyle, width: '100%', marginTop: 24 }}>Go Pro →</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section style={{ padding: sectionPad, maxWidth: 640, margin: '0 auto' }}>
        <Reveal>
          <h2 style={{ ...h2Style, marginBottom: 32 }}>Questions your<br/><span style={{ color: green }}>mates will ask.</span></h2>
        </Reveal>
        <Reveal delay={.1}>
          <Faq q="Do my mates need to pay?" a="No. One Season Pass covers the entire pool. Your mates join free with the link you send them — they'll never see a paywall."/>
          <Faq q="Which leagues can we predict?" a="Premier League, Championship, League One and the World Cup — all with fixtures and results synced automatically. More leagues coming."/>
          <Faq q="Is this gambling?" a="No. No money changes hands inside InTheLeague — it's score predictions for points and bragging rights only. What your group does at the pub is your business."/>
          <Faq q="Can we set our own scoring rules?" a="The default is +3 exact score, +1 correct result. Season Pass organisers can customise scoring and lock the rules once the season starts."/>
          <Faq q="What happens at the end of the season?" a="The final table is settled, a champion is crowned, and the group chat is unbearable for a week. Then you do it all again."/>
        </Reveal>
      </section>

      {/* ── 8. FINAL CTA ── */}
      <section style={{ padding: 'clamp(80px,16vw,160px) 20px', textAlign: 'center', borderTop: '1px solid #0d0d0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-40%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, #1DB95412 0%, transparent 65%)', pointerEvents: 'none' }}/>
        <Reveal>
          <h2 style={{ ...h2Style, fontSize: 'clamp(48px,12vw,96px)' }}>The group chat<br/><span style={{ color: green }}>needs this.</span></h2>
        </Reveal>
        <Reveal delay={.15}>
          <div style={{ margin: '48px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#444', marginBottom: 20 }}>Season kicks off in</div>
            <Countdown/>
          </div>
        </Reveal>
        <Reveal delay={.25}>
          <button className="cta-btn" onClick={onGetStarted} style={{ ...ctaStyle, fontSize: 17, padding: '18px 44px' }}>Start your pool free →</button>
          <div style={{ fontSize: 12, color: '#333', marginTop: 16 }}>No card. No downloads. Just bragging rights.</div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #0d0d0d', padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-.03em', color: '#fff' }}>In<em style={{ color: green, fontStyle: 'normal' }}>The</em>League</div>
        <div style={{ fontSize: 11, color: '#333' }}>© 2026 InTheLeague · Made for the group chat</div>
      </footer>
    </div>
  )
}
