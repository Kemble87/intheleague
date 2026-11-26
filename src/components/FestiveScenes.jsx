// Festive League activation scenes for the five chips.
// Shown full-screen behind the confirmation sheet (see CinemaModal in Chips.jsx).
// Every animation uses `both` fill, so the end state is what's left on screen.

const DISP = "'Space Grotesk','Inter',system-ui,sans-serif"
const MONO = "'Share Tech Mono',ui-monospace,monospace"

export const festiveSceneStyles = `
@keyframes fs-pop{0%{transform:scale(0);opacity:0;}70%{transform:scale(1.12);opacity:1;}100%{transform:scale(1);opacity:1;}}
@keyframes fs-slam{0%{transform:scale(3);opacity:0;}25%{transform:scale(.94);opacity:1;}40%{transform:scale(1.05);}100%{transform:scale(1);opacity:1;}}
@keyframes fs-rise{0%{transform:translateY(12px);opacity:0;}100%{transform:translateY(0);opacity:1;}}
@keyframes fs-grow{0%{transform:scaleY(0);opacity:0;}100%{transform:scaleY(1);opacity:1;}}
@keyframes fs-stardrop{0%{transform:translateY(-70vh) rotate(-200deg);opacity:0;}15%{opacity:1;}75%{transform:translateY(6px) rotate(8deg);}88%{transform:translateY(-5px) rotate(-3deg);}100%{transform:translateY(0) rotate(0);opacity:1;}}
@keyframes fs-glow{0%,100%{filter:drop-shadow(0 0 6px #FFD700);}50%{filter:drop-shadow(0 0 22px #FFE7A3) drop-shadow(0 0 44px #FFD700);}}
@keyframes fs-steam{0%{transform:translateY(8px);opacity:0;}40%{opacity:.75;}100%{transform:translateY(-26px);opacity:0;}}
@keyframes fs-wiggle{0%,100%{transform:rotate(0);}20%{transform:rotate(-5deg);}40%{transform:rotate(5deg);}60%{transform:rotate(-4deg);}80%{transform:rotate(3deg);}}
@keyframes fs-lid{0%{transform:translate(0,0) rotate(0);}100%{transform:translate(44px,-6px) rotate(34deg);}}
@keyframes fs-card{0%{transform:translateY(26px) scale(.5);opacity:0;}100%{transform:translateY(var(--y)) scale(1);opacity:1;}}
@keyframes fs-burst{0%{transform:scale(0) rotate(-60deg);opacity:0;}60%{transform:scale(1.25) rotate(8deg);opacity:1;}100%{transform:scale(1) rotate(0);opacity:1;}}
@keyframes fs-out{0%{transform:scale(1);opacity:1;}100%{transform:scale(.5);opacity:0;}}
@keyframes fs-flash{0%,100%{opacity:0;}30%{opacity:.55;}}
@keyframes fs-left{0%{transform:translateX(0);}100%{transform:translateX(-34%);}}
@keyframes fs-right{0%{transform:translateX(0) scale(.4);opacity:0;}100%{transform:translateX(34%) scale(1);opacity:1;}}
@keyframes fs-bite{0%{transform:scale(0);}100%{transform:scale(1);}}
@keyframes fs-snow{0%{transform:translateY(-10vh);opacity:0;}10%{opacity:var(--o);}90%{opacity:var(--o);}100%{transform:translateY(110vh);opacity:0;}}
@media (prefers-reduced-motion: reduce){.fs-scene *{animation-duration:.01s !important;animation-delay:0s !important;animation-iteration-count:1 !important;}}
`

const FLAKES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 13.7 + 5) % 100, size: 2 + (i % 3), dur: 7 + (i % 5) * 2.2, delay: -(i * 1.3), o: 0.25 + (i % 4) * 0.12,
}))

function Scene({ glow, flat, children }) {
  return (
    <div className="fs-scene" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: `radial-gradient(ellipse at 50% 38%, ${glow} 0%, ${glow} ${flat ? 42 : 0}%, #000 ${flat ? 80 : 72}%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '24vh' }}>
      {FLAKES.map((f, i) => (
        <span key={i} style={{ position: 'absolute', top: 0, left: f.left + '%', width: f.size, height: f.size, borderRadius: '50%', background: '#fff', '--o': f.o, opacity: 0, animation: `fs-snow ${f.dur}s linear ${f.delay}s infinite` }}/>
      ))}
      {children}
    </div>
  )
}

function Caption({ children, color, delay }) {
  return (
    <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color, marginTop: 22, textAlign: 'center', padding: '0 20px', lineHeight: 1.6, animation: `fs-rise .4s ${delay}s ease both` }}>{children}</div>
  )
}

function Plate({ style }) {
  return (
    <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '46%', left: '27%', top: '16%', ...style }}>
      <circle cx="50" cy="50" r="48" fill="#F6F5EF"/>
      <circle cx="50" cy="50" r="35" fill="none" stroke="#D9D3C0" strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="30" fill="#FBFAF5"/>
    </svg>
  )
}

// Double Helpings — one plate becomes two
export function SceneHelpings() {
  return (
    <Scene glow="#2a0508">
      <div style={{ position: 'relative', width: 'min(78vw, 340px)', height: 'min(52vw, 226px)' }}>
        <Plate style={{ animation: 'fs-pop .35s ease both, fs-left .4s .5s cubic-bezier(.3,1.3,.5,1) forwards' }}/>
        <Plate style={{ animation: 'fs-right .4s .5s cubic-bezier(.3,1.3,.5,1) both' }}/>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISP, fontSize: 'clamp(64px,19vw,104px)', fontWeight: 800, letterSpacing: '-.05em', color: '#FFD700', textShadow: '0 4px 0 #7E141C, 0 0 30px rgba(0,0,0,.6)', animation: 'fs-slam .35s .85s cubic-bezier(.22,1,.36,1) both' }}>2×</div>
      </div>
      <Caption color="#FF8A8F" delay={1.05}>Double helpings · served</Caption>
    </Scene>
  )
}

// Star on the Tree — the star lands, the match is worth triple
export function SceneStarTree() {
  const baubles = [[41, 44, '#FF3B5C'], [59, 58, '#FFD700'], [34, 62, '#FFD700'], [50, 74, '#FF3B5C'], [66, 80, '#F6F5EF'], [30, 82, '#FF3B5C'], [46, 54, '#F6F5EF']]
  return (
    <Scene glow="#0a2413">
      <div style={{ position: 'relative', width: 'min(58vw, 240px)', height: 'min(66vw, 274px)' }}>
        <svg viewBox="0 0 100 114" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <g style={{ transformOrigin: '50px 100px', animation: 'fs-grow .6s cubic-bezier(.3,1.2,.5,1) both' }}>
            <rect x="45" y="94" width="10" height="10" fill="#6B4A2B"/>
            <polygon points="50,50 14,96 86,96" fill="#166029"/>
            <polygon points="50,32 22,72 78,72" fill="#1E7D37"/>
            <polygon points="50,16 30,48 70,48" fill="#27994A"/>
          </g>
          {baubles.map(([x, y, c], i) => (
            <circle key={i} cx={x} cy={y} r="3.2" fill={c} style={{ transformOrigin: `${x}px ${y}px`, animation: `fs-pop .25s ${0.6 + i * 0.08}s ease both` }}/>
          ))}
          <g style={{ transformOrigin: '50px 12px', animation: 'fs-stardrop .65s 1.05s cubic-bezier(.3,.9,.4,1) both' }}>
            <polygon points="50.0,0.0 53.3,7.5 61.4,8.3 55.3,13.7 57.1,21.7 50.0,17.6 42.9,21.7 44.7,13.7 38.6,8.3 46.7,7.5" fill="#FFD700" style={{ animation: 'fs-glow 1.6s 1.7s ease-in-out infinite' }}/>
          </g>
        </svg>
        <div style={{ position: 'absolute', right: '-14%', top: '34%', fontFamily: DISP, fontSize: 'clamp(34px,10vw,52px)', fontWeight: 800, color: '#FFD700', animation: 'fs-slam .3s 1.7s ease both' }}>3×</div>
      </div>
      <Caption color="#7BE39A" delay={1.9}>Star on the tree · triple points</Caption>
    </Scene>
  )
}

// Half-Time Mince Pie — a bite at the break, picks unlocked
export function SceneMincePie() {
  const BG = '#0a0418'
  return (
    <Scene glow={BG} flat>
      <div style={{ fontFamily: MONO, fontSize: 'clamp(26px,8vw,40px)', letterSpacing: '.12em', color: '#B794FF', animation: 'fs-rise .4s .1s ease both' }}>45:00</div>
      <div style={{ position: 'relative', width: 'min(64vw, 270px)', height: 'min(50vw, 210px)', marginTop: 26 }}>
        <svg viewBox="0 0 120 94" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          {[44, 60, 76].map((x, i) => (
            <path key={x} d={`M${x},30 q-5,-6 0,-12 q5,-6 0,-12`} stroke="#F6F5EF" strokeWidth="2.4" strokeLinecap="round" fill="none" style={{ opacity: 0, animation: `fs-steam 1.8s ${0.7 + i * 0.3}s ease-out infinite` }}/>
          ))}
          <g style={{ animation: 'fs-rise .5s .25s cubic-bezier(.3,1.3,.5,1) both' }}>
            <path d="M16,48 L25,84 Q60,92 95,84 L104,48 Z" fill="#C98A3C"/>
            {[28, 38, 49, 60, 71, 82, 92].map(x => <line key={x} x1={x} y1="56" x2={x + (60 - x) * 0.1} y2="85" stroke="#A56B25" strokeWidth="2"/>)}
            <ellipse cx="60" cy="47" rx="46" ry="15" fill="#EFC27A" stroke="#C98A3C" strokeWidth="2"/>
            <polygon points="60.0,36.0 62.8,43.2 70.5,43.6 64.5,48.4 66.5,55.9 60.0,51.7 53.5,55.9 55.5,48.4 49.5,43.6 57.2,43.2" fill="#7A1F2B"/>
            <g fill="#fff"><circle cx="34" cy="44" r="1.4"/><circle cx="42" cy="52" r="1.2"/><circle cx="82" cy="42" r="1.4"/><circle cx="90" cy="49" r="1.2"/><circle cx="74" cy="54" r="1.2"/><circle cx="46" cy="39" r="1.2"/></g>
          </g>
          {/* the bite */}
          <g style={{ transformOrigin: '100px 42px', animation: 'fs-bite .18s 1.5s ease-out both' }}>
            <circle cx="100" cy="42" r="15" fill={BG}/><circle cx="88" cy="33" r="6" fill={BG}/><circle cx="90" cy="54" r="6" fill={BG}/>
          </g>
        </svg>
      </div>
      <Caption color="#C9B3FF" delay={1.9}>Half-time · picks unlocked</Caption>
    </Scene>
  )
}

// Secret Santa — someone's picks, gift-wrapped for you
export function SceneSecretSanta({ members, myId }) {
  const others = (members || []).filter(([uid]) => uid !== myId)
  const cards = [['2', '1', -128, -58], ['1', '1', -176, -6], ['3', '0', -224, -54]]
  return (
    <Scene glow="#04222a">
      <div style={{ position: 'relative', width: 'min(52vw, 210px)', height: 'min(70vw, 290px)' }}>
        {cards.map(([h, a, y, x], i) => (
          <div key={i} style={{ position: 'absolute', left: '50%', bottom: '34%', marginLeft: x - 30, width: 60, padding: '7px 0', borderRadius: 8, background: '#F6F5EF', color: '#0E120F', fontFamily: MONO, fontSize: 17, fontWeight: 700, textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,.5)', '--y': y + 'px', opacity: 0, animation: `fs-card .45s ${1.45 + i * 0.16}s cubic-bezier(.3,1.3,.5,1) both` }}>{h}–{a}</div>
        ))}
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', overflow: 'visible', transformOrigin: '50% 100%', animation: 'fs-pop .35s ease both, fs-wiggle .7s .45s ease forwards' }}>
          <rect x="12" y="44" width="76" height="54" rx="4" fill="#D12B36"/>
          <rect x="44" y="44" width="12" height="54" fill="#FFD700"/>
          <g style={{ transformOrigin: '50px 40px', animation: 'fs-lid .45s 1.2s cubic-bezier(.3,1.2,.5,1) both' }}>
            <rect x="7" y="30" width="86" height="17" rx="4" fill="#B4232C"/>
            <rect x="43" y="30" width="14" height="17" fill="#FFD700"/>
            <path d="M50,30 C34,8 18,20 50,30 C82,20 66,8 50,30 Z" fill="#FFD700"/>
          </g>
        </svg>
      </div>
      <Caption color="#5FE0EE" delay={2.05}>From: {others.length ? '???' : 'nobody yet'} · they'll never know</Caption>
    </Scene>
  )
}

// Christmas Miracle — the worst result of the round, rescued
export function SceneMiracle() {
  return (
    <Scene glow="#0a1436">
      <div style={{ position: 'relative', width: 'min(60vw, 250px)', height: 'min(60vw, 250px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: '-30%', borderRadius: '50%', background: 'radial-gradient(circle, #FFE7A3 0%, transparent 60%)', opacity: 0, animation: 'fs-flash .6s .45s ease both' }}/>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', animation: 'fs-burst .5s .45s cubic-bezier(.3,1.2,.5,1) both' }}>
          <path d="M76,24 Q56,50 76,76 Q50,56 24,76 Q44,50 24,24 Q50,44 76,24 Z" fill="#FFD700" opacity=".7"/>
          <path d="M50,0 Q54,46 100,50 Q54,54 50,100 Q46,54 0,50 Q46,46 50,0 Z" fill="#FFE7A3" style={{ animation: 'fs-glow 1.8s 1s ease-in-out infinite' }}/>
        </svg>
        <div style={{ position: 'absolute', fontFamily: DISP, fontSize: 'clamp(56px,17vw,92px)', fontWeight: 800, color: '#6b7280', animation: 'fs-pop .25s ease both, fs-out .2s .45s ease forwards' }}>0</div>
        <div style={{ position: 'relative', fontFamily: DISP, fontSize: 'clamp(56px,17vw,92px)', fontWeight: 800, color: '#0B1026', letterSpacing: '-.04em', animation: 'fs-slam .3s .7s cubic-bezier(.22,1,.36,1) both' }}>+1</div>
      </div>
      <Caption color="#FFE7A3" delay={0.95}>A Christmas miracle · worst result rescued</Caption>
    </Scene>
  )
}

export const FESTIVE_SCENES = { '2x': SceneHelpings, banker: SceneStarTree, hth: SceneMincePie, copycat: SceneSecretSanta, coupon: SceneMiracle }
