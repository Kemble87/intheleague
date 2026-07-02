import { getKit } from '../lib/kitColours'

export default function Kit({ team, size = 28, flip = false }) {
  const kit = getKit(team)
  const primary = kit?.home || '#444'
  const secondary = kit?.away || '#666'
  const sleeves = kit?.sleeves || null
  const pattern = kit?.sash
  const id = `clip-${(team||'x').replace(/\s/g,'-')}-${flip?'a':'h'}`

  return (
    <svg width={size} height={Math.round(size*1.1)} viewBox="0 0 40 44" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0, transform: flip ? 'scaleX(-1)' : 'none' }} aria-label={`${team} kit`}>
      <defs>
        <clipPath id={id}>
          <path d="M8,12 L2,18 L8,22 L8,40 L32,40 L32,22 L38,18 L32,12 L28,8 Q22,14 12,8 Z"/>
        </clipPath>
      </defs>

      {/* Shirt body */}
      <path d="M8,12 L2,18 L8,22 L8,40 L32,40 L32,22 L38,18 L32,12 L28,8 Q22,14 12,8 Z" fill={primary} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

      {/* Stripes pattern */}
      {pattern === 'stripes' && (
        <g clipPath={`url(#${id})`}>
          <rect x="0" y="0" width="8" height="44" fill={secondary}/>
          <rect x="16" y="0" width="8" height="44" fill={secondary}/>
          <rect x="32" y="0" width="8" height="44" fill={secondary}/>
        </g>
      )}

      {/* Sash pattern */}
      {pattern === 'sash' && (
        <path d="M28,8 L8,30 L8,40 L12,40 L38,12 L32,8 Z" fill={secondary} opacity="0.6"/>
      )}

      {/* Sleeves — explicit colour (e.g. Arsenal white sleeves) */}
      {sleeves && (
        <>
          <path d="M2,18 L8,12 L8,22 Z" fill={sleeves}/>
          <path d="M38,18 L32,12 L32,22 Z" fill={sleeves}/>
        </>
      )}

      {/* Default sleeve tint for non-pattern kits */}
      {!pattern && !sleeves && secondary !== primary && (
        <>
          <path d="M2,18 L8,12 L8,22 Z" fill={secondary} opacity="0.4"/>
          <path d="M38,18 L32,12 L32,22 Z" fill={secondary} opacity="0.4"/>
        </>
      )}

      {/* Collar */}
      <path d="M16,8 Q20,12 24,8" fill="none" stroke={sleeves || secondary} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
