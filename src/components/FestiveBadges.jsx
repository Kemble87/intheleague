// Festive League artwork for the five chips. Same hexagon frame as the
// standard badges (see Chips.jsx), with a snow-capped top and Christmas art.
const FONT = 'Inter,system-ui'
const HEX = '85,8 158,49 158,133 85,174 12,133 12,49'
const HEX_IN = '85,16 150,53 150,129 85,166 20,129 20,53'
const SNOW = 'M12,49 L85,8 L158,49 L158,59 Q149,52 141,58 Q132,46 122,50 Q113,37 103,40 Q94,28 85,31 Q76,28 67,40 Q57,37 48,50 Q38,46 29,58 Q21,52 12,59 Z'

function Frame({ fill, edge, line, label, label2, labelFill = '#FFE7A3', children }) {
  return (
    <svg viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <polygon points={HEX} fill={fill} stroke={edge} strokeWidth="1.5"/>
      <polygon points={HEX_IN} fill="none" stroke={line} strokeWidth="0.6" opacity="0.6"/>
      {children}
      <path d={SNOW} fill="#F6F5EF" opacity="0.95"/>
      <line x1="34" y1="131" x2="136" y2="131" stroke={labelFill} strokeWidth="0.8" opacity="0.45"/>
      <text x="85" y={label2 ? 142 : 147} textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="800" fill={labelFill} letterSpacing="2">{label}</text>
      {label2 && <text x="85" y="153" textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="800" fill={labelFill} letterSpacing="2">{label2}</text>}
      <circle cx="85" cy="165" r="2.5" fill={labelFill} opacity="0.6"/>
    </svg>
  )
}

// Double Helpings — a full plate, doubled
function BadgeHelpings({ active }) {
  return (
    <Frame fill="#1A0305" edge="#8B0000" line="#CC0000" label="DOUBLE" label2="HELPINGS">
      {/* fork */}
      <g stroke="#FFD700" strokeWidth="2.6" strokeLinecap="round" fill="none">
        <line x1="39" y1="72" x2="39" y2="124"/>
        <path d="M33,70 V83 Q33,89 39,89 Q45,89 45,83 V70"/>
      </g>
      {/* knife */}
      <path d="M131,70 Q139,84 133,98 L133,124 Q131,126 129,124 L129,70 Z" fill="#FFD700"/>
      {/* plate */}
      <circle cx="85" cy="97" r="31" fill="#F6F5EF"/>
      <circle cx="85" cy="97" r="23" fill="none" stroke="#D9D3C0" strokeWidth="1.5"/>
      <text x="85" y="109" textAnchor="middle" fontFamily={FONT} fontSize="32" fontWeight="900" letterSpacing="-1.5"
        fill={active ? '#FF6600' : '#B4232C'} style={{ transition: 'fill .3s' }}>2×</text>
    </Frame>
  )
}

// Star on the Tree — one match, triple points
function BadgeStarTree({ active }) {
  return (
    <Frame fill="#04140A" edge="#14532D" line="#1E7D37" label="STAR ON" label2="THE TREE">
      <rect x="80" y="121" width="10" height="8" fill="#6B4A2B"/>
      <polygon points="85,92 55,123 115,123" fill="#166029"/>
      <polygon points="85,76 61,104 109,104" fill="#1E7D37"/>
      <polygon points="85,62 67,86 103,86" fill="#27994A"/>
      {/* baubles */}
      <circle cx="78" cy="82" r="2.6" fill="#FF3B5C"/><circle cx="93" cy="97" r="2.6" fill="#FFD700"/>
      <circle cx="72" cy="100" r="2.6" fill="#FFD700"/><circle cx="100" cy="116" r="2.6" fill="#FF3B5C"/>
      <circle cx="68" cy="117" r="2.6" fill="#F6F5EF"/><circle cx="85" cy="112" r="2.6" fill="#FF3B5C"/>
      {/* the star */}
      <polygon points="85.0,47.0 87.5,53.6 94.5,53.9 89.0,58.3 90.9,65.1 85.0,61.2 79.1,65.1 81.0,58.3 75.5,53.9 82.5,53.6" fill={active ? '#FFFFFF' : '#FFD700'}
        style={{ transition: 'fill .3s, transform .4s', transformOrigin: '85px 57px', transform: active ? 'scale(1.35)' : 'scale(1)' }}/>
      <text x="34" y="100" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill="#FFD700">3×</text>
      <text x="136" y="100" textAnchor="middle" fontFamily={FONT} fontSize="11" fill="#FFE7A3" opacity="0.5">★</text>
    </Frame>
  )
}

// Half-Time Mince Pie — a rethink at the break
function BadgeMincePie({ active }) {
  return (
    <Frame fill="#080418" edge="#330066" line="#6600CC" label="HALF-TIME" label2="MINCE PIE" labelFill="#E9DCC0">
      {/* steam */}
      <g stroke="#F6F5EF" strokeWidth="2" strokeLinecap="round" fill="none" opacity={active ? 0.9 : 0.45} style={{ transition: 'opacity .3s' }}>
        <path d="M72,76 Q67,70 72,64 Q77,58 72,52"/>
        <path d="M98,76 Q93,70 98,64 Q103,58 98,52"/>
      </g>
      {/* pie case */}
      <path d="M50,92 L57,121 Q85,127 113,121 L120,92 Z" fill="#C98A3C"/>
      {[60,68,76,85,94,102,110].map(x => <line key={x} x1={x} y1="98" x2={x + (x - 85) * -0.08} y2="121" stroke="#A56B25" strokeWidth="1.6"/>)}
      {/* lid */}
      <ellipse cx="85" cy="91" rx="36" ry="12" fill="#EFC27A" stroke="#C98A3C" strokeWidth="1.5"/>
      <polygon points="85.0,81.0 87.2,86.9 93.6,87.2 88.6,91.2 90.3,97.3 85.0,93.8 79.7,97.3 81.4,91.2 76.4,87.2 82.8,86.9" fill="#7A1F2B"/>
      {/* icing sugar */}
      <g fill="#FFFFFF" opacity="0.9">
        <circle cx="62" cy="89" r="1.2"/><circle cx="70" cy="95" r="1"/><circle cx="104" cy="88" r="1.2"/>
        <circle cx="110" cy="93" r="1"/><circle cx="98" cy="97" r="1"/><circle cx="74" cy="85" r="1"/>
      </g>
      <text x="134" y="78" textAnchor="middle" fontFamily={FONT} fontSize="10" fontWeight="800" fill="#B794FF">45'</text>
    </Frame>
  )
}

// Secret Santa — copy someone's picks on the quiet
function BadgeSecretSanta({ active }) {
  return (
    <Frame fill="#021418" edge="#00505C" line="#00AACC" label="SECRET" label2="SANTA">
      {/* hat */}
      <path d="M50,113 C56,84 74,62 100,64 C113,65 123,74 128,88 L118,91 C114,83 108,81 103,83 C109,93 115,104 117,113 Z"
        fill={active ? '#FF3B5C' : '#D12B36'} style={{ transition: 'fill .3s' }}/>
      <circle cx="126" cy="91" r="8.5" fill="#F6F5EF"/>
      <rect x="44" y="109" width="80" height="15" rx="7.5" fill="#F6F5EF"/>
      <text x="82" y="105" textAnchor="middle" fontFamily={FONT} fontSize="24" fontWeight="900" fill="#FFFFFF" opacity="0.92">?</text>
      <text x="36" y="80" textAnchor="middle" fontFamily={FONT} fontSize="10" fill="#00CCDD" opacity="0.6">★</text>
    </Frame>
  )
}

// Christmas Miracle — your worst result, rescued
function BadgeMiracle({ active }) {
  return (
    <Frame fill="#050B1E" edge="#1B2D6B" line="#4488FF" label="CHRISTMAS" label2="MIRACLE">
      <circle cx="85" cy="93" r="27" fill="none" stroke="#FFD700" strokeWidth="1" opacity={active ? 0.7 : 0.3} style={{ transition: 'opacity .3s' }}/>
      <path d="M103,75 Q89,93 103,111 Q85,97 67,111 Q81,93 67,75 Q85,89 103,75 Z" fill="#FFD700" opacity="0.75"/>
      <path d="M85,59 Q88,90 119,93 Q88,96 85,127 Q82,96 51,93 Q82,90 85,59 Z" fill={active ? '#FFFFFF' : '#FFE7A3'} style={{ transition: 'fill .3s' }}/>
      <g stroke="#FFE7A3" strokeWidth="1.6" strokeLinecap="round">
        <path d="M38,72 v8 M34,76 h8"/><path d="M132,110 v8 M128,114 h8"/><path d="M130,68 v6 M127,71 h6"/>
      </g>
    </Frame>
  )
}

export const FESTIVE_BADGES = { '2x': BadgeHelpings, banker: BadgeStarTree, hth: BadgeMincePie, copycat: BadgeSecretSanta, coupon: BadgeMiracle }
