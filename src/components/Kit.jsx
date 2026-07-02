import { getKit } from '../lib/kitColours'

export default function Kit({ team, size = 28, flip = false }) {
  const kit = getKit(team)
  const primary = kit?.home || '#444'
  const secondary = kit?.away || '#666'
  const pattern = kit?.sash

  // Classic football shirt SVG
  // flip=true mirrors it for away team
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 40 44"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, transform: flip ? 'scaleX(-1)' : 'none' }}
      aria-label={`${team} kit`}
    >
      {/* Shirt body */}
      <path d="M8,12 L2,18 L8,22 L8,40 L32,40 L32,22 L38,18 L32,12 L28,8 Q22,14 12,8 Z" fill={primary} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

      {/* Sleeves */}
      <path d="M8,12 Q12,8 12,8 L8,22 Z" fill={primary} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
      <path d="M32,12 Q28,8 28,8 L32,22 Z" fill={primary} stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

      {/* Collar */}
      <path d="M16,8 Q20,12 24,8" fill="none" stroke={secondary} strokeWidth="2" strokeLinecap="round"/>

      {/* Pattern overlay */}
      {pattern === 'stripes' && (
        <>
          <rect x="17" y="8" width="3" height="32" fill={secondary} opacity="0.8"/>
          <rect x="23" y="8" width="3" height="32" fill={secondary} opacity="0.8"/>
        </>
      )}
      {pattern === 'sash' && (
        <path d="M28,8 L8,30 L8,40 L12,40 L38,12 L32,8 Z" fill={secondary} opacity="0.6"/>
      )}
      {!pattern && secondary !== primary && (
        // Subtle sleeve colour for non-pattern kits
        <>
          <path d="M8,12 Q10,8 12,8 L8,22 Z" fill={secondary} opacity="0.5"/>
          <path d="M32,12 Q30,8 28,8 L32,22 Z" fill={secondary} opacity="0.5"/>
        </>
      )}

      {/* Shirt number placeholder - small dot for realism */}
      <circle cx="20" cy="26" r="2" fill={secondary} opacity="0.4"/>
    </svg>
  )
}
