import { useState, useEffect } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { rtdb } from '../lib/firebase'

// ── SVG BADGES ──────────────────────────────────────────────────────────────
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
      <text x="85" y="115" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="48" fontWeight="900" fill={active ? "#FF6600" : "#FFD700"} letterSpacing="-2" style={{ transition: 'fill .3s' }}>2×</text>
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
      {active && <rect x="44" y="68" width="82" height="68" rx="3" fill="#FFD700" opacity="0.1"/>}
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
      <polygon points="85,24 142,57 142,125 85,158 28,125 28,57" fill="none" stroke="#C0C0C0" strokeWidth="0.5" opacity="0.25"/>
      <polygon points="93,52 72,100 84,100 71,138 100,90 86,90 99,52" fill="#220044" opacity="0.3"/>
      <polygon points="92,54 71,100 83,100 70,136 99,90 85,90 98,54" fill={active ? "#CC88FF" : "#9966FF"} style={{ transition: 'fill .3s', filter: active ? 'drop-shadow(0 0 8px #9966FF)' : 'none' }}/>
      <polygon points="92,54 71,100 83,100 70,136 99,90 85,90 98,54" fill="none" stroke="#C0C0C0" strokeWidth="0.8" opacity="0.6"/>
      {['22,80','138,80','22,130','138,130'].map((pos, i) => <text key={i} x={pos.split(',')[0]} y={pos.split(',')[1]} fontFamily="Inter,system-ui" fontSize="11" fill="#C0C0C0" opacity="0.4">★</text>)}
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
      {[['56,97','70,99'],['56,103','70,103'],['94,99','108,97'],['94,103','108,103']].map(([p1,p2],i) => (
        <line key={i} x1={p1.split(',')[0]} y1={p1.split(',')[1]} x2={p2.split(',')[0]} y2={p2.split(',')[1]} stroke="#00AACC" strokeWidth="1" opacity="0.6"/>
      ))}
      <line x1="104" y1="118" x2="122" y2="136" stroke="#00AACC" strokeWidth="5" strokeLinecap="round"
        style={{ transform: active ? 'rotate(-20deg)' : 'rotate(0deg)', transformOrigin: '104px 118px', transition: 'transform .4s ease' }}/>
      <line x1="104" y1="118" x2="122" y2="136" stroke="#00EEFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="28" y1="134" x2="142" y2="134" stroke="#00CCDD" strokeWidth="0.8" opacity="0.4"/>
      <text x="85" y="149" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="9" fontWeight="700" fill="#00CCDD" letterSpacing="4">COPYCAT</text>
      <text x="85" y="50" textAnchor="middle" fontFamily="Inter,system-ui" fontSize="7" fontWeight="600" fill="#00AACC" letterSpacing="4" opacity="0.8">CHIP</text>
      <circle cx="85" cy="18" r="3" fill="#00CCDD" opacity="0.6"/>
      <circle cx="85" cy="164" r="3" fill="#00CCDD" opacity="0.6"/>
    </svg>
  )
}

// ── CHIP DEFS ────────────────────────────────────────────────────────────────
const CHIP_DEFS = [
  { id: '2x',     name: '2× Multiplier',  color: '#FFD700', desc: 'Double your points for every pick this matchday.',      warning: 'One use per season.', Badge: Badge2x      },
  { id: 'banker', name: 'Banker',          color: '#4499FF', desc: 'Triple your points on one specific match.',             warning: 'One use per month.',  Badge: BadgeBanker  },
  { id: 'hth',    name: 'Half Time Hero',  color: '#9966FF', desc: 'Change all your picks at half time for one matchday.',  warning: 'One use per season.', Badge: BadgeHalfTime},
  { id: 'copycat',name: 'Copycat',         color: '#00CCDD', desc: "Mirror a player's complete picks for one matchday.",    warning: 'One use per season.', Badge: BadgeCopycat },
]

// ── MODAL ────────────────────────────────────────────────────────────────────
function ChipModal({ chip, onConfirm, onCancel }) {
  const { Badge, name, desc, warning, color } = chip
  return (
    <div className="cinema-overlay">
      <div className="cinema-sheet up">
        <div className="cinema-sheet-pip"/>
        <div style={{ width: 100, height: 100, margin: '0 auto 16px' }}><Badge active /></div>
        <div className="cinema-sheet-name">{name}</div>
        <div className="cinema-sheet-desc">{desc}</div>
        <div className="cinema-sheet-warn">⚠ {warning}</div>
        <div className="cinema-sheet-btns">
          <button className="cinema-cancel" onClick={onCancel}>Cancel</button>
          <button className="cinema-confirm" style={{ background: color }} onClick={onConfirm}>Activate</button>
        </div>
      </div>
    </div>
  )
}

// ── CHIPS SECTION ────────────────────────────────────────────────────────────
export default function Chips({ poolId, userId, members }) {
  const [used, setUsed] = useState({})
  const [confirming, setConfirming] = useState(null)

  useEffect(() => {
    const r = ref(rtdb, `pools/${poolId}/chips/${userId}`)
    const u = onValue(r, s => setUsed(s.val() || {}))
    return () => u()
  }, [poolId, userId])

  function activate(chip) {
    set(ref(rtdb, `pools/${poolId}/chips/${userId}/${chip.id}`), { usedAt: Date.now() })
    setUsed(u => ({ ...u, [chip.id]: { usedAt: Date.now() } }))
    setConfirming(null)
  }

  return (
    <div className="chips-section">
      <div className="chips-title">Your chips</div>
      <div className="chips-grid">
        {CHIP_DEFS.map(chip => {
          const isUsed = !!used[chip.id]
          const isActive = confirming?.id === chip.id
          return (
            <div key={chip.id} style={{ position: 'relative' }}>
              <button
                className={`chip-btn${isUsed ? ' used' : ''}`}
                disabled={isUsed}
                onClick={() => !isUsed && setConfirming(chip)}
                title={isUsed ? 'Already used' : chip.name}
              >
                <chip.Badge active={isActive} />
              </button>
              {isUsed && <div className="chip-used-badge">USED</div>}
            </div>
          )
        })}
      </div>
      {confirming && (
        <ChipModal
          chip={confirming}
          onConfirm={() => activate(confirming)}
          onCancel={() => setConfirming(null)}
        />
      )}
    </div>
  )
}
