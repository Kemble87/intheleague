import { useState, useEffect, useRef } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { rtdb } from '../lib/firebase'

// ── BADGE SVGs ───────────────────────────────────────────────────────────────
function Badge2x({ active }) {
  return (
    <svg viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#1A0305" stroke="#8B0000" strokeWidth="1.5"/>
      <polygon points="85,16 150,53 150,129 85,166 20,129 20,53" fill="none" stroke="#CC0000" strokeWidth="0.5" opacity="0.5"/>
      <polygon points="85,24 142,57 142,125 85,158 28,125 28,57" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.25"/>
      <line x1="20" y1="60" x2="60" y2="100" stroke="#2a0000" strokeWidth="10" opacity="0.6"/>
      <line x1="40" y1="50" x2="90" y2="100" stroke="#2a0000" strokeWidth="10" opacity="0.6"/>
      <line x1="65" y1="45" x2="130" y2="110" stroke="#2a0000" strokeWidth="10" opacity="0.6"/>
      <line x1="95" y1="45" x2="150" y2="100" stroke="#2a0000" strokeWidth="10" opacity="0.5"/>
      <text x="85" y="118" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="52" fontWeight="900" fill="#CC0000" letterSpacing="-2" opacity="0.2">2×</text>
      <text x="85" y="115" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="48" fontWeight="900" fill={active ? '#FF6600' : '#FFD700'} letterSpacing="-2" style={{ transition: 'fill .3s' }}>2×</text>
      <line x1="32" y1="130" x2="138" y2="130" stroke="#FFD700" strokeWidth="0.8" opacity="0.5"/>
      <text x="85" y="145" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="9" fontWeight="700" fill="#FFD700" letterSpacing="3">MULTIPLIER</text>
      <line x1="32" y1="56" x2="138" y2="56" stroke="#FFD700" strokeWidth="0.8" opacity="0.5"/>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#CC0000" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#FFD700" opacity="0.6"/>
      <circle cx="85" cy="164" r="3" fill="#FFD700" opacity="0.6"/>
    </svg>
  )
}

function BadgeBanker({ active }) {
  return (
    <svg viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#020818" stroke="#002244" strokeWidth="1.5"/>
      <polygon points="85,16 150,53 150,129 85,166 20,129 20,53" fill="none" stroke="#003366" strokeWidth="0.5" opacity="0.5"/>
      <rect x="38" y="62" width="94" height="80" rx="4" fill="#001133" stroke="#0044AA" strokeWidth="1.5"/>
      <rect x="44" y="68" width="82" height="68" rx="3" fill="#001A44" stroke="#003388" strokeWidth="1"/>
      {[44,55,66,77,88,99,110].map((x,i) => <line key={i} x1={x} y1="68" x2={x} y2="136" stroke="#FFD700" strokeWidth="2.5" opacity="0.7"/>)}
      <line x1="38" y1="84" x2="132" y2="84" stroke="#FFD700" strokeWidth="1.5" opacity="0.4"/>
      <line x1="38" y1="120" x2="132" y2="120" stroke="#FFD700" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="85" cy="96" r="16" fill="#002255" stroke="#0055CC" strokeWidth="1.5"/>
      <circle cx="85" cy="96" r="3" fill="#FFD700"/>
      <line x1="85" y1="96" x2="85" y2="87" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="44" y="68" width="41" height="68" rx="2" fill="#002255" stroke="#0055CC" strokeWidth="1"
        style={{ transformOrigin: '44px 102px', transform: active ? 'perspective(400px) rotateY(-90deg)' : 'perspective(400px) rotateY(0deg)', transition: 'transform .6s ease' }}/>
      <rect x="118" y="92" width="9" height="8" rx="2" fill="#0055CC"/>
      <line x1="28" y1="136" x2="142" y2="136" stroke="#FFD700" strokeWidth="0.8" opacity="0.4"/>
      <text x="85" y="151" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="9" fontWeight="700" fill="#FFD700" letterSpacing="4">BANKER</text>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#0055CC" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#FFD700" opacity="0.6"/>
      <circle cx="85" cy="164" r="3" fill="#FFD700" opacity="0.6"/>
    </svg>
  )
}

function BadgeHalfTime({ active }) {
  return (
    <svg viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#080418" stroke="#330066" strokeWidth="1.5"/>
      <polygon points="85,16 150,53 150,129 85,166 20,129 20,53" fill="none" stroke="#6600CC" strokeWidth="0.5" opacity="0.5"/>
      <polygon points="93,52 72,100 84,100 71,138 100,90 86,90 99,52" fill="#220044" opacity="0.3"/>
      <polygon points="92,54 71,100 83,100 70,136 99,90 85,90 98,54" fill={active ? '#CC88FF' : '#9966FF'} style={{ transition: 'fill .3s' }}/>
      <polygon points="92,54 71,100 83,100 70,136 99,90 85,90 98,54" fill="none" stroke="#C0C0C0" strokeWidth="0.8" opacity="0.6"/>
      <text x="22" y="80" fontFamily="Inter,system-ui" fontSize="11" fill="#C0C0C0" opacity="0.4">★</text>
      <text x="138" y="80" fontFamily="Inter,system-ui" fontSize="11" fill="#C0C0C0" opacity="0.4">★</text>
      <line x1="28" y1="134" x2="142" y2="134" stroke="#C0C0C0" strokeWidth="0.8" opacity="0.3"/>
      <text x="85" y="147" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="8" fontWeight="700" fill="#C0C0C0" letterSpacing="3">HALF TIME</text>
      <text x="85" y="159" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="8" fontWeight="700" fill="#C0C0C0" letterSpacing="5">HERO</text>
      <text x="85" y="52" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#9966FF" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#C0C0C0" opacity="0.5"/>
      <circle cx="85" cy="164" r="3" fill="#C0C0C0" opacity="0.5"/>
    </svg>
  )
}

function BadgeCopycat({ active }) {
  return (
    <svg viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#020E14" stroke="#003344" strokeWidth="1.5"/>
      <polygon points="85,16 150,53 150,129 85,166 20,129 20,53" fill="none" stroke="#005566" strokeWidth="0.5" opacity="0.5"/>
      <circle cx="82" cy="96" r="30" fill="none" stroke="#00AACC" strokeWidth="3"/>
      <circle cx="82" cy="96" r="24" fill="#001A20" stroke="#004455" strokeWidth="1"/>
      <polygon points="72,82 76,70 80,82" fill="#007799"/>
      <polygon points="84,82 88,70 92,82" fill="#007799"/>
      <ellipse cx="76" cy="95" rx="5" ry="6" fill="#00DDFF" style={{ transform: active ? 'translateX(-3px)' : 'translateX(0)', transition: 'transform .3s' }}/>
      <ellipse cx="88" cy="95" rx="5" ry="6" fill="#00DDFF" style={{ transform: active ? 'translateX(-3px)' : 'translateX(0)', transition: 'transform .3s' }}/>
      <ellipse cx="76" cy="95" rx="1.5" ry="5.5" fill="#001014"/>
      <ellipse cx="88" cy="95" rx="1.5" ry="5.5" fill="#001014"/>
      <path d="M78,105 Q82,110 86,105" fill="none" stroke="#00AACC" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="56" y1="97" x2="70" y2="99" stroke="#00AACC" strokeWidth="1" opacity="0.6"/>
      <line x1="56" y1="103" x2="70" y2="103" stroke="#00AACC" strokeWidth="1" opacity="0.6"/>
      <line x1="94" y1="99" x2="108" y2="97" stroke="#00AACC" strokeWidth="1" opacity="0.6"/>
      <line x1="94" y1="103" x2="108" y2="103" stroke="#00AACC" strokeWidth="1" opacity="0.6"/>
      <line x1="104" y1="118" x2="122" y2="136" stroke="#00AACC" strokeWidth="5" strokeLinecap="round"
        style={{ transform: active ? 'rotate(-20deg)' : 'rotate(0deg)', transformOrigin: '104px 118px', transition: 'transform .4s ease' }}/>
      <line x1="28" y1="134" x2="142" y2="134" stroke="#00CCDD" strokeWidth="0.8" opacity="0.4"/>
      <text x="85" y="149" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="9" fontWeight="700" fill="#00CCDD" letterSpacing="4">COPYCAT</text>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#00AACC" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#00CCDD" opacity="0.6"/>
      <circle cx="85" cy="164" r="3" fill="#00CCDD" opacity="0.6"/>
    </svg>
  )
}

// ── CINEMATIC SCENES ─────────────────────────────────────────────────────────
const sceneStyles = `
@keyframes num-slam{0%{transform:scale(3);opacity:0;}20%{transform:scale(.95);opacity:1;}30%{transform:scale(1.04);}100%{transform:scale(1);opacity:1;}}
@keyframes red-flash{0%,100%{background:#000;}8%{background:#1a0000;}15%{background:#000;}}
@keyframes line-in{0%{transform:scaleX(0);}100%{transform:scaleX(1);}}
@keyframes dial-spin-lock{0%{transform:rotate(0);}80%{transform:rotate(740deg);}90%{transform:rotate(720deg);}100%{transform:rotate(730deg);}}
@keyframes vault-door-shut{0%{transform:perspective(600px) rotateY(-95deg);}55%{transform:perspective(600px) rotateY(-6deg);}70%{transform:perspective(600px) rotateY(-16deg);}85%{transform:perspective(600px) rotateY(-2deg);}100%{transform:perspective(600px) rotateY(0deg);}}
@keyframes bolt-slide-r{0%,65%{transform:translateX(0);}100%{transform:translateX(14px);}}
@keyframes gold-dim-out{0%{opacity:1;}65%{opacity:.8;}100%{opacity:0;}}
@keyframes vault-locked-text{0%,82%{opacity:0;transform:translateY(8px);}100%{opacity:1;transform:translateY(0);}}
@keyframes score-reveal{0%,10%{opacity:0;transform:scale(.8);}20%,60%{opacity:1;transform:scale(1);}80%,100%{opacity:0;transform:scale(.95);}}
@keyframes watch-in{0%{opacity:0;transform:scale(.7);}100%{opacity:1;transform:scale(1);}}
@keyframes hand-sweep{0%{transform:rotate(-90deg);}100%{transform:rotate(270deg);}}
@keyframes watch-smash{0%,60%{transform:scale(1);opacity:1;}70%{transform:scale(1.15);opacity:.6;}85%{transform:scale(.9) rotate(8deg);opacity:.3;}100%{transform:scale(.7) rotate(15deg);opacity:0;}}
@keyframes bolt-strike-down{0%{opacity:0;transform:scaleY(0) translateX(-50%);transform-origin:top;}15%{opacity:1;transform:scaleY(1) translateX(-50%);}70%{opacity:1;}100%{opacity:0;transform:scaleY(1) translateX(-50%);}}
@keyframes impact-flash{84%,86%{background:radial-gradient(ellipse at center,#2a0066 0%,#000 70%);}0%,100%{background:radial-gradient(ellipse at center,#0d0020 0%,#000 70%);}}
@keyframes spark-fly{0%{opacity:1;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(var(--sx),var(--sy)) scale(0);}}
@keyframes hth-text-in{0%,72%{opacity:0;transform:translateY(10px);}100%{opacity:1;transform:translateY(0);}}
@keyframes glow-pulse-bolt{0%,100%{filter:drop-shadow(0 0 6px #9966FF);}50%{filter:drop-shadow(0 0 24px #CC44FF) drop-shadow(0 0 48px #6600CC);}}
@keyframes magnifier-in-sweep{0%{opacity:0;transform:scale(.4) translate(-130%,-50%);}25%{opacity:1;transform:scale(1) translate(-130%,-50%);}100%{transform:scale(1) translate(130%,-50%);}}
@keyframes player-name-in{0%{opacity:0;transform:translateY(-8px);}100%{opacity:1;transform:translateY(0);}}
@keyframes copy-done{0%,85%{opacity:0;transform:translateY(8px);}100%{opacity:1;transform:translateY(0);}}
@keyframes sheet-slide-up{0%{transform:translateY(100%);}100%{transform:translateY(0);}}
`

function Scene2x() {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#000', animation:'red-flash .6s ease forwards', position:'relative' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center,#1a0000 0%,#000 70%)' }}/>
      <div style={{ position:'absolute', bottom:'30%', left:'8%', right:'8%', height:1, background:'linear-gradient(to right,transparent,#CC0000,transparent)', animation:'line-in .4s .3s ease both', transform:'scaleX(0)', transformOrigin:'center' }}/>
      <div style={{ position:'relative', zIndex:2, textAlign:'center' }}>
        <div style={{ fontSize:'clamp(90px,22vw,150px)', fontWeight:900, letterSpacing:'-.05em', color:'#fff', animation:'num-slam .35s cubic-bezier(.22,1,.36,1) forwards', lineHeight:1 }}>2×</div>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.3em', textTransform:'uppercase', color:'#CC0000', marginTop:10, animation:'line-in .3s .4s ease both', transform:'scaleX(0)', transformOrigin:'left' }}>Multiplier active</div>
      </div>
    </div>
  )
}

function SceneBanker() {
  const bars = [0,1,2,3,4,5]
  const bolts = [28,50,72]
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:28, background:'radial-gradient(ellipse at center,#001133 0%,#000 70%)' }}>
      <div style={{ width:'clamp(160px,38vw,210px)', height:'clamp(160px,38vw,210px)', border:'3px solid #0033AA', borderRadius:8, background:'#000D22', position:'relative', overflow:'hidden', boxShadow:'0 0 40px #001155' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 35% 50%,#995500 0%,transparent 55%)', animation:'gold-dim-out 1.9s ease forwards', zIndex:1 }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', zIndex:0 }}>
          {bars.map(i => <div key={i} style={{ flex:1, borderRight:'1.5px solid #003388' }}/>)}
        </div>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', zIndex:2, animation:'score-reveal 1.9s ease forwards' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#FFD700', opacity:.7, marginBottom:4 }}>Your banker</div>
          <div style={{ fontFamily:'ui-monospace,monospace', fontSize:'clamp(32px,8vw,48px)', fontWeight:900, color:'#FFD700', textShadow:'0 0 20px #FF8800' }}>2 – 1</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:600, marginTop:4 }}>Arsenal v Chelsea</div>
        </div>
        {bolts.map((t,i) => <div key={i} style={{ position:'absolute', top:t+'%', right:0, width:16, height:5, background:'#0055CC', borderRadius:'2px 0 0 2px', zIndex:5, animation:'bolt-slide-r 1.9s cubic-bezier(.25,.46,.45,.94) forwards' }}/>)}
        <div style={{ position:'absolute', top:0, left:0, width:'55%', height:'100%', background:'#001A44', borderRight:'2px solid #0055CC', transformOrigin:'left center', transform:'perspective(600px) rotateY(-95deg)', animation:'vault-door-shut 1.5s .3s cubic-bezier(.4,0,.2,1) forwards', zIndex:4 }}>
          <div style={{ position:'absolute', inset:8, border:'1px solid #003388', borderRadius:3, background:'#001133' }}>
            <div style={{ width:44, height:44, borderRadius:'50%', border:'2px solid #0055CC', background:'#000D22', position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'dial-spin-lock 1.5s .3s cubic-bezier(.25,.46,.45,.94) forwards' }}>
              <div style={{ position:'absolute', top:3, left:'50%', transform:'translateX(-50%)', width:2, height:8, background:'#FFD700', borderRadius:2 }}/>
            </div>
            <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:9, height:24, borderRadius:5, background:'#0044AA', border:'1px solid #0066DD' }}/>
          </div>
        </div>
      </div>
      <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase', color:'#FFD700', animation:'vault-locked-text .4s 1.8s ease both', opacity:0 }}>🔒 Banker locked in</div>
    </div>
  )
}

function SceneHTH() {
  const [time, setTime] = useState('00:00')
  useEffect(() => {
    const start = Date.now()
    const duration = 1600
    const iv = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration)
      const mins = Math.floor(p * 45)
      const secs = Math.floor((p * 45 * 60) % 60)
      setTime(`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`)
      if (p >= 1) { clearInterval(iv); setTime('45:00') }
    }, 40)
    return () => clearInterval(iv)
  }, [])

  const sparks = [
    {sx:'-40px',sy:'-30px',l:'45%',t:'44%',c:'#CC44FF'},
    {sx:'45px',sy:'-25px',l:'50%',t:'44%',c:'#fff'},
    {sx:'-20px',sy:'35px',l:'44%',t:'47%',c:'#9966FF'},
    {sx:'30px',sy:'40px',l:'52%',t:'46%',c:'#CC44FF'},
    {sx:'-50px',sy:'10px',l:'46%',t:'45%',c:'#fff'},
    {sx:'20px',sy:'-45px',l:'51%',t:'43%',c:'#9966FF'},
    {sx:'55px',sy:'15px',l:'48%',t:'45%',c:'#CC44FF'},
  ]

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at center,#0d0020 0%,#000 70%)', animation:'impact-flash 2.4s ease forwards', position:'relative' }}>
      <div style={{ position:'relative' }}>
        <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', width:14, height:12, background:'#330066', border:'2px solid #6600CC', borderRadius:'3px 3px 0 0' }}/>
        <div style={{ width:'clamp(130px,32vw,170px)', height:'clamp(130px,32vw,170px)', borderRadius:'50%', background:'#0d0020', border:'3px solid #6600CC', boxShadow:'0 0 0 1px #440088, 0 0 30px #22006644', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', animation:'watch-in .4s cubic-bezier(.22,1,.36,1) forwards, watch-smash .5s 1.8s ease forwards' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 160 160">
            <g transform="translate(80,80)">
              <line x1="0" y1="-68" x2="0" y2="-58" stroke="#330055" strokeWidth="2"/>
              <line x1="68" y1="0" x2="58" y2="0" stroke="#330055" strokeWidth="2"/>
              <line x1="0" y1="68" x2="0" y2="58" stroke="#330055" strokeWidth="2"/>
              <line x1="-68" y1="0" x2="-58" y2="0" stroke="#330055" strokeWidth="2"/>
              <line x1="58.9" y1="34" x2="48" y2="27.7" stroke="#9966FF" strokeWidth="2"/>
              <text x="38" y="52" textAnchor="middle" fontFamily="ui-monospace" fontSize="9" fill="#6600CC" fontWeight="700">45</text>
            </g>
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', animation:'hand-sweep 1.6s linear forwards' }}>
            <div style={{ width:2, height:50, background:'linear-gradient(to bottom,#CC44FF,#9966FF)', borderRadius:2, transformOrigin:'bottom center', position:'absolute', bottom:'50%' }}/>
          </div>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#9966FF', position:'absolute', zIndex:2, boxShadow:'0 0 8px #9966FF' }}/>
          <div style={{ position:'absolute', bottom:22, textAlign:'center' }}>
            <div style={{ fontFamily:'ui-monospace,monospace', fontSize:22, fontWeight:700, color:'#fff' }}>{time}</div>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'#6600CC', marginTop:2 }}>Half Time</div>
          </div>
        </div>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:60, opacity:0, pointerEvents:'none', zIndex:10, animation:'bolt-strike-down .4s 1.75s ease forwards, glow-pulse-bolt .3s 1.75s ease' }}>
          <svg width="60" height="180" viewBox="0 0 80 200" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,0 28,90 44,90 18,200 62,100 44,100 68,0" fill="#9966FF"/>
            <polygon points="50,0 28,90 44,90 18,200 62,100 44,100 68,0" fill="none" stroke="#CC88FF" strokeWidth="1" opacity="0.8"/>
            <polygon points="50,0 28,90 44,90 18,200 62,100 44,100 68,0" fill="#ffffff" opacity="0.15"/>
          </svg>
        </div>
      </div>
      {sparks.map((s,i) => (
        <div key={i} style={{ position:'absolute', left:s.l, top:s.t, width:4, height:4, borderRadius:'50%', background:s.c, animation:`spark-fly .5s ${1.85+i*.04}s ease forwards`, opacity:0, '--sx':s.sx, '--sy':s.sy }}/>
      ))}
      <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:'#9966FF', animation:'hth-text-in .4s 2.3s ease both', opacity:0, marginTop:24, textShadow:'0 0 20px #6600CC' }}>Half Time Hero activated</div>
    </div>
  )
}

function SceneCopycat({ members, myId }) {
  const [revealed, setRevealed] = useState([])
  const picks = [
    { home:'Arsenal', away:'Chelsea', h:2, a:1 },
    { home:'Man City', away:'Liverpool', h:1, a:1 },
    { home:'Spurs', away:'Man Utd', h:3, a:0 },
  ]
  const targets = (members || []).filter(([uid]) => uid !== myId)
  const target = targets[0] ? targets[0][1] : { name: 'Your rival' }
  const nameParts = (target.name || '').split(' ')
  const display = nameParts[0] + (nameParts[1] ? ' ' + nameParts[1][0] + '.' : '')

  useEffect(() => {
    let delay = 500
    picks.forEach((_, i) => {
      ['h','a'].forEach(side => {
        setTimeout(() => setRevealed(r => [...r, `${i}-${side}`]), delay)
        delay += 200
      })
    })
  }, [])

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', background:'radial-gradient(ellipse at center,#001A20 0%,#000 70%)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:'#00AACC', marginBottom:6, animation:'player-name-in .3s .2s ease both', opacity:0 }}>Copying picks from</div>
        <div style={{ fontSize:'clamp(28px,8vw,48px)', fontWeight:900, letterSpacing:'-.03em', color:'#fff', marginBottom:20, animation:'player-name-in .3s .35s ease both', opacity:0 }}>
          {display.split(' ')[0]} <span style={{ color:'#00CCDD' }}>{display.split(' ')[1] || ''}</span>
        </div>
        {picks.map((p,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontSize:'clamp(12px,3vw,15px)', fontWeight:700, marginBottom:8 }}>
            <span style={{ color:'#444', minWidth:'clamp(50px,14vw,90px)', textAlign:'right' }}>{p.home}</span>
            <div style={{ display:'flex', alignItems:'center', gap:5, minWidth:52, justifyContent:'center' }}>
              <span style={{ fontFamily:'ui-monospace,monospace', fontSize:'clamp(18px,5vw,26px)', fontWeight:700, color: revealed.includes(`${i}-h`) ? '#fff' : '#111', background: revealed.includes(`${i}-h`) ? '#1a1a1a' : '#111', borderRadius:4, padding:'2px 7px', minWidth:32, textAlign:'center', transition:'color .12s, background .12s' }}>
                {revealed.includes(`${i}-h`) ? p.h : '?'}
              </span>
              <span style={{ color:'#222', fontSize:16 }}>–</span>
              <span style={{ fontFamily:'ui-monospace,monospace', fontSize:'clamp(18px,5vw,26px)', fontWeight:700, color: revealed.includes(`${i}-a`) ? '#fff' : '#111', background: revealed.includes(`${i}-a`) ? '#1a1a1a' : '#111', borderRadius:4, padding:'2px 7px', minWidth:32, textAlign:'center', transition:'color .12s, background .12s' }}>
                {revealed.includes(`${i}-a`) ? p.a : '?'}
              </span>
            </div>
            <span style={{ color:'#444', minWidth:'clamp(50px,14vw,90px)', textAlign:'left' }}>{p.away}</span>
          </div>
        ))}
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.2em', textTransform:'uppercase', color:'#00CCDD', marginTop:20, animation:'copy-done .4s 2.2s ease both', opacity:0 }}>Picks copied</div>
      </div>
      <div style={{ position:'absolute', top:'58%', transform:'translateY(-50%)', animation:'magnifier-in-sweep .5s cubic-bezier(.22,1,.36,1) forwards', pointerEvents:'none' }}>
        <div style={{ width:'clamp(90px,22vw,130px)', height:'clamp(90px,22vw,130px)', borderRadius:'50%', border:'3px solid #00AACC', boxShadow:'0 0 0 1px #00EEFF33, inset 0 0 24px #001A2066', background:'#001A2044', position:'relative' }}>
          <div style={{ position:'absolute', top:'10%', left:'10%', width:'25%', height:'25%', borderRadius:'50%', background:'#00EEFF18' }}/>
          <div style={{ position:'absolute', bottom:'-30%', right:'-16%', width:4, height:'clamp(36px,9vw,52px)', background:'#00AACC', borderRadius:3, transform:'rotate(45deg)', boxShadow:'0 0 6px #00CCDD' }}/>
        </div>
      </div>
    </div>
  )
}

// ── SCENE: COUPON BUSTER ─────────────────────────────────────────────────────
function SceneCouponBuster() {
  const [phase, setPhase] = useState(0) // 0=slip in, 1=bust, 2=saved, 3=rescued

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 750),
      setTimeout(() => setPhase(2), 1900),
      setTimeout(() => setPhase(3), 2300),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const selections = [
    { match:'Arsenal v Chelsea',   pick:'Arsenal 2–1', pts:0, rescued: true },
    { match:'Man City v Liverpool', pick:'Draw 1–1',   pts:3, rescued: false },
    { match:'Spurs v Newcastle',    pick:'Spurs 2–0',  pts:1, rescued: false },
    { match:'West Ham v Wolves',    pick:'Draw 1–1',   pts:1, rescued: false },
  ]

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#0a0a0a', position:'relative', overflow:'hidden' }}>
      {/* Slip */}
      <div style={{
        width:260, background:'#fff', borderRadius:3,
        boxShadow:'0 12px 48px rgba(0,0,0,.8)',
        position:'relative', overflow:'visible',
        transform: phase === 0 ? 'translateY(-120%) rotate(-6deg)' : phase === 1 ? 'translateY(0) rotate(0deg)' : 'translateY(0)',
        transition:'transform .65s cubic-bezier(.22,1,.36,1)',
        animation: phase === 1 ? 'none' : undefined,
      }}>
        {/* Tear top */}
        <div style={{ height:8, background:'#fff', borderRadius:'3px 3px 0 0', borderBottom:'2px dashed #ddd' }}/>
        {/* Green header */}
        <div style={{ background:'#1a6b1a', padding:'8px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:13, fontWeight:900, color:'#fff', letterSpacing:'.04em' }}>InTheLeague</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.7)', letterSpacing:'.12em', textTransform:'uppercase' }}>Match Predictions · MD14</div>
          </div>
          <span style={{ fontSize:20 }}>⚽</span>
        </div>
        {/* Barcode stripe */}
        <div style={{ height:3, background:'repeating-linear-gradient(90deg,#000 0,#000 2px,#fff 2px,#fff 4px,#000 4px,#000 5px,#fff 5px,#fff 8px)', opacity:.12 }}/>
        {/* Selections */}
        <div style={{ padding:'10px 12px' }}>
          <div style={{ fontSize:8, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'#888', marginBottom:8, paddingBottom:6, borderBottom:'1px solid #eee' }}>Your selections</div>
          {selections.map((s, i) => {
            const isRescued = s.rescued && phase >= 3
            const ptsDisplay = isRescued ? '+1 ↑' : s.pts === 0 ? '0 ✗' : `+${s.pts} ✓`
            const ptsColor = isRescued ? '#1a6b1a' : s.pts === 0 ? '#CC0000' : '#1a6b1a'
            return (
              <div key={i} style={{ padding:'6px 0', borderBottom: i<3 ? '1px dotted #e8e8e8' : 'none' }}>
                <div style={{ fontSize:9, color:'#888', fontWeight:600, letterSpacing:'.03em', marginBottom:2 }}>{s.match}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:11, fontWeight:800, color:'#111' }}>{s.pick}</span>
                  <span style={{ fontFamily:'ui-monospace,monospace', fontSize:11, fontWeight:700, color: ptsColor, background: isRescued ? '#e8f5e8' : 'transparent', padding: isRescued ? '1px 5px' : 0, borderRadius:3, transition:'all .3s' }}>{ptsDisplay}</span>
                </div>
              </div>
            )
          })}
        </div>
        {/* Footer */}
        <div style={{ background:'#f5f5f5', padding:'10px 12px', borderTop:'1px solid #e0e0e0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontSize:9, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'.1em' }}>Chip</span>
            <span style={{ fontSize:9, fontWeight:800, color: phase >= 2 ? '#1a6b1a' : '#CC0000', fontFamily:'ui-monospace,monospace' }}>{phase >= 2 ? '✓ Applied' : 'Coupon Buster'}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:6, borderTop:'1px solid #ddd' }}>
            <span style={{ fontSize:11, fontWeight:900, color:'#111', textTransform:'uppercase', letterSpacing:'.06em' }}>Total</span>
            <span style={{ fontSize:14, fontWeight:900, color: phase >= 3 ? '#1a6b1a' : '#111', fontFamily:'ui-monospace,monospace', transition:'color .3s' }}>{phase >= 3 ? '5 pts' : '4 pts'}</span>
          </div>
        </div>
        <div style={{ height:8, background:'#f5f5f5', borderRadius:'0 0 3px 3px', borderTop:'2px dashed #ddd' }}/>

        {/* BUST stamp */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <div style={{
            fontFamily:'Inter,system-ui', fontSize:42, fontWeight:900, letterSpacing:'.1em',
            color:'#CC0000', border:'5px solid #CC0000', borderRadius:4, padding:'4px 14px',
            transform:'rotate(-10deg)',
            opacity: phase === 1 ? 1 : 0,
            scale: phase === 1 ? '1' : '3',
            transition: phase === 1 ? 'opacity .1s, scale .4s cubic-bezier(.22,1,.36,1)' : 'opacity .3s',
          }}>BUST</div>
        </div>

        {/* SAVED stamp */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <div style={{
            fontFamily:'Inter,system-ui', fontSize:36, fontWeight:900, letterSpacing:'.08em',
            color:'#1a6b1a', border:'5px solid #1a6b1a', borderRadius:4, padding:'4px 14px',
            transform:'rotate(6deg)',
            opacity: phase >= 2 ? 1 : 0,
            transition:'opacity .4s cubic-bezier(.22,1,.36,1)',
          }}>SAVED</div>
        </div>
      </div>

      {/* Status text */}
      <div style={{ marginTop:24, fontSize:12, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'#4CAF50', opacity: phase >= 3 ? 1 : 0, transition:'opacity .4s', textAlign:'center' }}>
        Worst result rescued · +1 pt added
      </div>
    </div>
  )
}

// ── CINEMA MODAL ─────────────────────────────────────────────────────────────
function CinemaModal({ chip, members, myId, onConfirm, onCancel }) {
  const [sheetUp, setSheetUp] = useState(false)
  const delay = chip.id === 'banker' ? 1800 : chip.id === 'copycat' ? 2400 : chip.id === 'hth' ? 2400 : 900

  useEffect(() => {
    const t = setTimeout(() => setSheetUp(true), delay)
    return () => clearTimeout(t)
  }, [])

  const scenes = {
    '2x': <Scene2x />,
    'banker': <SceneBanker />,
    'hth': <SceneHTH />,
    'copycat': <SceneCopycat members={members} myId={myId} />,
    'coupon': <SceneCouponBuster />,
  }

  return (
    <>
      <style>{sceneStyles}</style>
      <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#000', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'absolute', inset:0 }}>{scenes[chip.id]}</div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'#0d0d0d', borderTop:'1px solid #1a1a1a', borderRadius:'20px 20px 0 0', padding:'20px 20px 36px', zIndex:10, transform: sheetUp ? 'translateY(0)' : 'translateY(100%)', transition:'transform .35s cubic-bezier(.25,.46,.45,.94)' }}>
          <div style={{ width:28, height:3, background:'#222', borderRadius:99, margin:'0 auto 16px' }}/>
          <div style={{ fontSize:18, fontWeight:800, color:'#fff', letterSpacing:'-.02em', marginBottom:4 }}>{chip.name}</div>
          <div style={{ fontSize:13, color:'#444', lineHeight:1.5, marginBottom:4 }}>{chip.desc}</div>
          <div style={{ fontSize:11, color:'#882222', marginBottom:18 }}>⚠ {chip.warning}</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={onCancel} style={{ flex:1, padding:13, background:'#1a1a1a', border:'none', borderRadius:500, color:'#555', font:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex:2, padding:13, border:'none', borderRadius:500, color:'#000', font:'inherit', fontSize:13, fontWeight:800, cursor:'pointer', background:chip.color }}>
              {chip.id === 'coupon' ? 'Choose matchday →' : 'Choose →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function BadgeCouponBuster({ active }) {
  return (
    <svg viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%' }}>
      <polygon points="85,8 158,49 158,133 85,174 12,133 12,49" fill="#0a1a0a" stroke="#1a6b1a" strokeWidth="1.5"/>
      <polygon points="85,16 150,53 150,129 85,166 20,129 20,53" fill="none" stroke="#2d8b2d" strokeWidth="0.5" opacity="0.5"/>
      <polygon points="85,24 142,57 142,125 85,158 28,125 28,57" fill="none" stroke="#4CAF50" strokeWidth="0.5" opacity="0.25"/>
      {/* Slip background */}
      <rect x="32" y="54" width="106" height="88" rx="3" fill="#f5f0e8" opacity={active ? 1 : 0.9}/>
      {/* Green header */}
      <rect x="32" y="54" width="106" height="18" rx="3" fill="#1a6b1a"/>
      <rect x="32" y="66" width="106" height="6" fill="#1a6b1a"/>
      <text x="85" y="66" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="900" fill="#fff" letterSpacing=".04em">COUPON</text>
      {/* Dotted rows */}
      <line x1="36" y1="82" x2="134" y2="82" stroke="#ccc" strokeWidth="0.5" strokeDasharray="2 2"/>
      <line x1="36" y1="96" x2="134" y2="96" stroke="#ccc" strokeWidth="0.5" strokeDasharray="2 2"/>
      <line x1="36" y1="110" x2="134" y2="110" stroke="#ccc" strokeWidth="0.5" strokeDasharray="2 2"/>
      {/* Selection rows */}
      <rect x="36" y="85" width="60" height="7" rx="1" fill="#ddd" opacity="0.6"/>
      <text x="128" y="91" textAnchor="end" fontFamily="Share Tech Mono,ui-monospace" fontSize="7" fontWeight="700" fill="#1a6b1a">✓</text>
      <rect x="36" y="99" width="50" height="7" rx="1" fill="#ddd" opacity="0.6"/>
      <text x="128" y="105" textAnchor="end" fontFamily="Share Tech Mono,ui-monospace" fontSize="7" fontWeight="700" fill="#CC0000">✗</text>
      <rect x="36" y="113" width="55" height="7" rx="1" fill="#ddd" opacity="0.6"/>
      <text x="128" y="119" textAnchor="end" fontFamily="Share Tech Mono,ui-monospace" fontSize="7" fontWeight="700" fill="#1a6b1a">✓</text>
      {/* Footer */}
      <rect x="32" y="124" width="106" height="18" fill="#f0f0f0" opacity="0.8"/>
      <line x1="32" y1="124" x2="138" y2="124" stroke="#ddd" strokeWidth="0.5"/>
      <text x="38" y="135" fontFamily="Inter,system-ui" fontSize="7" fontWeight="900" fill="#111" letterSpacing=".04em">TOTAL</text>
      <text x="132" y="135" textAnchor="end" fontFamily="Share Tech Mono,ui-monospace" fontSize="8" fontWeight="700" fill={active ? "#1a6b1a" : "#111"}>5 pts</text>
      {/* SAVED stamp */}
      <g transform={`rotate(${active ? -8 : -8}, 85, 95)`} opacity={active ? 1 : 0.7}>
        <rect x="48" y="82" width="74" height="22" rx="2" fill="none" stroke="#1a6b1a" strokeWidth="2.5"/>
        <text x="85" y="97" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="14" fontWeight="900" fill="#1a6b1a" letterSpacing=".08em">SAVED</text>
      </g>
      {/* Dividers */}
      <line x1="28" y1="148" x2="142" y2="148" stroke="#4CAF50" strokeWidth="0.8" opacity="0.4"/>
      <text x="85" y="161" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="8" fontWeight="700" fill="#4CAF50" letterSpacing="2">COUPON</text>
      <text x="85" y="171" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="8" fontWeight="700" fill="#4CAF50" letterSpacing="2">BUSTER</text>
      <line x1="28" y1="56" x2="142" y2="56" stroke="#4CAF50" strokeWidth="0.8" opacity="0.4"/>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#2d8b2d" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#4CAF50" opacity="0.6"/>
      <circle cx="85" cy="164" r="3" fill="#4CAF50" opacity="0.6"/>
    </svg>
  )
}

// ── CHIP DEFS ────────────────────────────────────────────────────────────────
const CHIP_DEFS = [
  { id:'2x',     name:'2× Multiplier',  color:'#FFD700', desc:'Double your points for every pick this matchday.',     warning:'One use per season.', Badge:Badge2x      },
  { id:'banker', name:'Banker',          color:'#4499FF', desc:'Triple your points on one specific match.',            warning:'One use per season.', Badge:BadgeBanker  },
  { id:'hth',    name:'Half Time Hero',  color:'#9966FF', desc:'Change all your picks at half time for one matchday.', warning:'One use per season.', Badge:BadgeHalfTime},
  { id:'copycat',name:'Copycat',         color:'#00CCDD', desc:"Mirror a player's complete picks for one matchday.",   warning:'One use per season.', Badge:BadgeCopycat },
  { id:'coupon', name:'Coupon Buster',   color:'#4CAF50', desc:'Your worst result this matchday is rescued — upgraded to the next points tier.', warning:'One use per season.', Badge:BadgeCouponBuster },
]

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function Chips({ poolId, userId, members, fixtures }) {
  const [used, setUsed] = useState({})
  const [confirming, setConfirming] = useState(null)
  const [chipStep, setChipStep] = useState(null) // '2x-pick-md' | 'banker-pick-match' | 'copycat-pick-player'
  const [stepData, setStepData] = useState({})

  useEffect(() => {
    const r = ref(rtdb, `pools/${poolId}/chips/${userId}`)
    const u = onValue(r, s => setUsed(s.val() || {}))
    return () => u()
  }, [poolId, userId])

  function activate(chip, extraData = {}) {
    const data = { usedAt: Date.now(), ...extraData }
    set(ref(rtdb, `pools/${poolId}/chips/${userId}/${chip.id}`), data)
    setUsed(u => ({ ...u, [chip.id]: data }))
    setConfirming(null)
    setChipStep(null)
    setStepData({})
  }

  // Step picker screens shown after cinema
  function handleCinemaConfirm(chip) {
    if (chip.id === '2x') { setConfirming(null); setChipStep('2x-pick-md') }
    else if (chip.id === 'banker') { setConfirming(null); setChipStep('banker-pick-match') }
    else if (chip.id === 'copycat') { setConfirming(null); setChipStep('copycat-pick-player') }
    else if (chip.id === 'coupon') { setConfirming(null); setChipStep('coupon-pick-md') }
    else if (chip.id === 'hth') { setConfirming(null); setChipStep('hth-pick-md') }
    else { activate(chip) }
  }

  const now = new Date()
  const upcomingMatchdays = [...new Set((fixtures||[])
    .filter(f => new Date(f.kickoff) > now)
    .map(f => f.matchday).filter(Boolean)
  )].sort((a,b) => a-b).slice(0, 15)

  // If no upcoming (e.g. pre-season), show first 15 matchdays from all fixtures
  const allMatchdays = [...new Set((fixtures||[])
    .map(f => f.matchday).filter(Boolean)
  )].sort((a,b) => a-b).slice(0, 15)

  const displayMatchdays = upcomingMatchdays.length > 0 ? upcomingMatchdays : allMatchdays

  const upcomingMatches = (fixtures||[])
    .filter(f => new Date(f.kickoff) > now)
    .slice(0, 20)

  // If no upcoming matches, show first 20
  const displayMatches = upcomingMatches.length > 0 ? upcomingMatches : (fixtures||[]).slice(0, 20)

  const teammates = (members||[]).filter(([uid]) => uid !== userId)

  return (
    <div className="chips-section">
      <div className="chips-title">Your chips</div>
      <div className="chips-grid">
        {CHIP_DEFS.map(chip => {
          const isUsed = !!used[chip.id]
          const isActive = confirming?.id === chip.id
          // Show chip-specific used info
          const usedData = used[chip.id]
          const usedLabel = isUsed ? (
            chip.id === '2x' ? (usedData?.matchday ? `MD${usedData.matchday}` : 'USED') :
            chip.id === 'banker' ? (usedData?.home ? `${usedData.home.slice(0,3).toUpperCase()}` : 'LOCKED') :
            chip.id === 'hth' ? (usedData?.matchday ? `MD${usedData.matchday}` : 'USED') :
            chip.id === 'coupon' ? (usedData?.matchday ? `MD${usedData.matchday}` : 'USED') :
            'USED'
          ) : null
          return (
            <div key={chip.id} style={{ position:'relative' }}>
              <button className={`chip-btn${isUsed ? ' used' : ''}`} disabled={isUsed} onClick={() => !isUsed && setConfirming(chip)} title={isUsed ? 'Already used' : chip.name}>
                <chip.Badge active={isActive} />
              </button>
              {isUsed && <div className="chip-used-badge">{usedLabel}</div>}
            </div>
          )
        })}
      </div>

      {/* Cinema activation modal */}
      {confirming && (
        <CinemaModal
          chip={confirming}
          members={members}
          myId={userId}
          onConfirm={() => handleCinemaConfirm(confirming)}
          onCancel={() => setConfirming(null)}
        />
      )}

      {/* 2x — Pick matchday */}
      {chipStep === '2x-pick-md' && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.95)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end' }}>
          <div style={{ width:'100%', maxWidth:480, background:'#111', borderRadius:'20px 20px 0 0', padding:'24px 20px 40px' }}>
            <div style={{ width:28, height:3, background:'#333', borderRadius:99, margin:'0 auto 20px' }}/>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:6 }}>⚡ Choose your matchday</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>Your points for this matchday will be doubled.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:'50vh', overflowY:'auto' }}>
              {displayMatchdays.map(md => (
                <button key={md} onClick={() => activate(CHIP_DEFS.find(c=>c.id==='2x'), { matchday: md })}
                  style={{ padding:'14px 16px', background: stepData.matchday===md ? '#0d2b19' : '#1a1a1a', border: stepData.matchday===md ? '1px solid var(--green)' : '1px solid #222', borderRadius:10, color:'#fff', font:'inherit', fontSize:15, fontWeight:700, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span>Matchday {md}</span>
                  <span style={{ fontSize:12, color:'#555' }}>2× points</span>
                </button>
              ))}
              {displayMatchdays.length === 0 && <div style={{ color:'#444', fontSize:14, textAlign:'center', padding:'20px 0' }}>No upcoming matchdays found. Sync fixtures first.</div>}
            </div>
            <button onClick={() => setChipStep(null)} style={{ width:'100%', marginTop:16, padding:14, background:'none', border:'1px solid #222', borderRadius:500, color:'#555', font:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Banker — Pick match */}
      {chipStep === 'banker-pick-match' && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.95)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end' }}>
          <div style={{ width:'100%', maxWidth:480, background:'#111', borderRadius:'20px 20px 0 0', padding:'24px 20px 40px' }}>
            <div style={{ width:28, height:3, background:'#333', borderRadius:99, margin:'0 auto 20px' }}/>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:6 }}>🏦 Choose your banker match</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>Your points on this match will be tripled. Pick wisely.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:'50vh', overflowY:'auto' }}>
              {displayMatches.map(f => (
                <button key={f.id} onClick={() => activate(CHIP_DEFS.find(c=>c.id==='banker'), { fixtureId: f.id, home: f.home, away: f.away })}
                  style={{ padding:'12px 16px', background:'#1a1a1a', border:'1px solid #222', borderRadius:10, color:'#fff', font:'inherit', fontSize:14, fontWeight:600, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                  <span>{f.home} v {f.away}</span>
                  <span style={{ fontSize:11, color:'#555', whiteSpace:'nowrap' }}>MD{f.matchday}</span>
                </button>
              ))}
              {displayMatches.length === 0 && <div style={{ color:'#444', fontSize:14, textAlign:'center', padding:'20px 0' }}>No upcoming matches found. Sync fixtures first.</div>}
            </div>
            <button onClick={() => setChipStep(null)} style={{ width:'100%', marginTop:16, padding:14, background:'none', border:'1px solid #222', borderRadius:500, color:'#555', font:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Copycat — Pick player */}
      {chipStep === 'copycat-pick-player' && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.95)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end' }}>
          <div style={{ width:'100%', maxWidth:480, background:'#111', borderRadius:'20px 20px 0 0', padding:'24px 20px 40px' }}>
            <div style={{ width:28, height:3, background:'#333', borderRadius:99, margin:'0 auto 20px' }}/>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:6 }}>🐱 Choose who to copy</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>Their picks for the next matchday will be copied to you. They won't know.</div>
            {teammates.length === 0 ? (
              <div style={{ color:'#444', fontSize:14, textAlign:'center', padding:'20px 0' }}>You need at least one other player in the pool to use Copycat.</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {teammates.map(([uid, m]) => (
                  <button key={uid} onClick={() => {
                    // Copy their picks for the next upcoming matchday
                    const nextMD = displayMatchdays[0]
                    activate(CHIP_DEFS.find(c=>c.id==='copycat'), { targetUid: uid, targetName: m.name, matchday: nextMD })
                  }}
                    style={{ padding:'14px 16px', background:'#1a1a1a', border:'1px solid #222', borderRadius:10, color:'#fff', font:'inherit', fontSize:15, fontWeight:600, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'#00CCDD22', border:'1px solid #00CCDD44', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#00CCDD', flexShrink:0 }}>
                      {(m.name||'?').slice(0,2).toUpperCase()}
                    </div>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setChipStep(null)} style={{ width:'100%', marginTop:16, padding:14, background:'none', border:'1px solid #222', borderRadius:500, color:'#555', font:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Half Time Hero — Pick matchday */}
      {chipStep === 'hth-pick-md' && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.95)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end' }}>
          <div style={{ width:'100%', maxWidth:480, background:'#111', borderRadius:'20px 20px 0 0', padding:'24px 20px 40px' }}>
            <div style={{ width:28, height:3, background:'#333', borderRadius:99, margin:'0 auto 20px' }}/>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:6 }}>⏱ Choose your matchday</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>You can change all your picks at half time for this matchday.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:'50vh', overflowY:'auto' }}>
              {displayMatchdays.length === 0
                ? <div style={{ color:'#444', fontSize:14, textAlign:'center', padding:'20px 0' }}>No matchdays found. Sync fixtures first.</div>
                : displayMatchdays.map(md => (
                  <button key={md}
                    onClick={() => activate(CHIP_DEFS.find(c => c.id === 'hth'), { matchday: md })}
                    style={{ padding:'14px 16px', background:'#1a1a1a', border:'1px solid #222', borderRadius:10, color:'#fff', font:'inherit', fontSize:15, fontWeight:700, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span>Matchday {md}</span>
                    <span style={{ fontSize:12, color:'#555' }}>Half time edits unlocked</span>
                  </button>
                ))
              }
            </div>
            <button onClick={() => setChipStep(null)} style={{ width:'100%', marginTop:16, padding:14, background:'none', border:'1px solid #222', borderRadius:500, color:'#555', font:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Coupon Buster — Pick matchday */}
      {chipStep === 'coupon-pick-md' && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.95)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end' }}>
          <div style={{ width:'100%', maxWidth:480, background:'#111', borderRadius:'20px 20px 0 0', padding:'24px 20px 40px' }}>
            <div style={{ width:28, height:3, background:'#333', borderRadius:99, margin:'0 auto 20px' }}/>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:6 }}>🎟 Choose your matchday</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>Your worst result that matchday gets rescued — upgraded to the next points tier.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:'50vh', overflowY:'auto' }}>
              {displayMatchdays.length === 0
                ? <div style={{ color:'#444', fontSize:14, textAlign:'center', padding:'20px 0' }}>No matchdays found. Sync fixtures first.</div>
                : displayMatchdays.map(md => (
                  <button key={md}
                    onClick={() => activate(CHIP_DEFS.find(c => c.id === 'coupon'), { matchday: md })}
                    style={{ padding:'14px 16px', background:'#1a1a1a', border:'1px solid #222', borderRadius:10, color:'#fff', font:'inherit', fontSize:15, fontWeight:700, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span>Matchday {md}</span>
                    <span style={{ fontSize:12, color:'#555' }}>Worst result rescued</span>
                  </button>
                ))
              }
            </div>
            <button onClick={() => setChipStep(null)} style={{ width:'100%', marginTop:16, padding:14, background:'none', border:'1px solid #222', borderRadius:500, color:'#555', font:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
