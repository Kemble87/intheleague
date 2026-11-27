import { isFestiveSeason } from '../lib/constants'

// A letter wearing a little Santa hat — used on the "I" of the InTheLeague logo.
// Sized in em so it scales with whichever logo it sits on. Disappears after the
// festive season (see isFestiveSeason).
export default function SantaHatLetter({ children = 'I' }) {
  if (!isFestiveSeason()) return children
  return (
    <span style={{ position: 'relative', display: 'inline-block', color: 'inherit' }}>
      {children}
      <svg
        viewBox="0 0 40 34" aria-hidden="true" focusable="false"
        style={{
          position: 'absolute', left: '-0.26em', top: '-0.2em', width: '0.8em', height: 'auto',
          transform: 'rotate(-12deg)', transformOrigin: '30% 90%', overflow: 'visible', pointerEvents: 'none',
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.35))',
        }}
      >
        {/* hat body flopping to the right */}
        <path d="M4,27 C6,15 13,5 24,4 C31,3.5 36,8 37,15 L33,16 C31,12 28,11 25,12 C28,17 30,22 31,27 Z" fill="#E5302F" />
        <path d="M14,24 C16,16 20,10 25,8" stroke="#B4232C" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".55" />
        {/* pompom */}
        <circle cx="35.5" cy="17.5" r="4.2" fill="#F6F5EF" />
        {/* fur brim */}
        <rect x="1" y="24.5" width="33" height="8" rx="4" fill="#F6F5EF" />
      </svg>
    </span>
  )
}
