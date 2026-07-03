import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { initials } from '../lib/helpers'
import { SPORTS } from '../lib/constants'

const SCORING_RULES = [
  { pts: 3, label: 'Exact score', eg: 'Pick 2–1, result is 2–1', color: '#1DB954' },
  { pts: 1, label: 'Correct result', eg: 'Pick 2–1, result is 3–0 (both home wins)', color: '#FFD60A' },
  { pts: 0, label: 'Wrong', eg: 'Pick 2–1, result is 0–1', color: '#444' },
]

export default function SideDrawer({ user, pools, activePoolId, onSwitchPool, invLink }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState(null)
  const [displayName, setDisplayName] = useState(user?.displayName || '')

  useEffect(() => {
    if (!open) setSection(null)
  }, [open])

  const activePool = pools?.find(p => p.id === activePoolId)

  return (
    <>
      {/* Trigger — initials avatar */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--green)', color: '#000',
          border: 'none', font: 'inherit', fontSize: 13, fontWeight: 800,
          cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}
      >
        {initials(user?.displayName || user?.email)}
        <span style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 14, height: 14, borderRadius: '50%',
          background: '#000', border: '1.5px solid #111',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="8" height="6" viewBox="0 0 8 6">
            <rect y="0" width="8" height="1.2" rx=".6" fill="#fff"/>
            <rect y="2.4" width="8" height="1.2" rx=".6" fill="#fff"/>
            <rect y="4.8" width="8" height="1.2" rx=".6" fill="#fff"/>
          </svg>
        </span>
      </button>

      {/* Full screen overlay */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', flexDirection: 'column',
          background: '#000',
          animation: 'drawerIn .25s cubic-bezier(.25,.46,.45,.94)',
        }}>
          <style>{`
            @keyframes drawerIn {
              from { opacity: 0; transform: translateY(24px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #111',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'var(--green)', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, flexShrink: 0,
              }}>
                {initials(user?.displayName || user?.email)}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>
                  {user?.displayName || user?.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{user?.email}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: '#111', border: '1px solid #222', borderRadius: '50%',
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#888', cursor: 'pointer', fontSize: 16, flexShrink: 0,
            }}>✕</button>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>

            {/* Switch pool */}
            {pools?.length > 0 && (
              <div style={{ padding: '12px 20px 4px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>
                  Your pools
                </div>
                {pools.map(pool => {
                  const s = SPORTS[pool.sport] || SPORTS.PL
                  const isActive = pool.id === activePoolId
                  return (
                    <button key={pool.id} onClick={() => { onSwitchPool(pool.id); setOpen(false) }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 12, marginBottom: 6,
                      background: isActive ? '#111' : 'none',
                      border: isActive ? '1px solid #1DB954' : '1px solid #111',
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: s.grad,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, flexShrink: 0,
                      }}>{s.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pool.name}</div>
                        <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{s.name}</div>
                      </div>
                      {isActive
                        ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }}/>
                        : <span style={{ color: '#333', fontSize: 18 }}>›</span>
                      }
                    </button>
                  )
                })}
              </div>
            )}

            <div style={{ height: 1, background: '#111', margin: '8px 0' }}/>

            {/* Invite */}
            {activePool && invLink && (
              <button onClick={() => { navigator.clipboard?.writeText(invLink); setOpen(false) }} style={rowStyle}>
                <div style={iconBox('#001a0d')}>👥</div>
                <div style={{ flex: 1 }}>
                  <div style={rowTitle}>Invite players</div>
                  <div style={rowSub}>Copy invite link for {activePool.name}</div>
                </div>
                <span style={{ color: '#333', fontSize: 18 }}>›</span>
              </button>
            )}

            {/* Scoring rules */}
            <button onClick={() => setSection(section === 'rules' ? null : 'rules')} style={rowStyle}>
              <div style={iconBox('#1a1400')}>📋</div>
              <div style={{ flex: 1 }}>
                <div style={rowTitle}>Scoring rules</div>
                <div style={rowSub}>How points are calculated</div>
              </div>
              <span style={{ color: '#333', fontSize: 12 }}>{section === 'rules' ? '▲' : '▼'}</span>
            </button>
            {section === 'rules' && (
              <div style={{ margin: '0 20px 8px', background: '#0d0d0d', borderRadius: 12, padding: '14px 16px' }}>
                {SCORING_RULES.map(r => (
                  <div key={r.pts} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: r.pts === 3 ? '#0d2b19' : r.pts === 1 ? '#221f00' : '#1a1a1a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 900, color: r.color,
                    }}>
                      {r.pts === 0 ? '✕' : '+' + r.pts}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{r.label}</div>
                      <div style={{ fontSize: 12, color: '#555', marginTop: 2, lineHeight: 1.4 }}>{r.eg}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profile */}
            <button onClick={() => setSection(section === 'profile' ? null : 'profile')} style={rowStyle}>
              <div style={iconBox('#111')}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={rowTitle}>Profile</div>
                <div style={rowSub}>Change your display name</div>
              </div>
              <span style={{ color: '#333', fontSize: 12 }}>{section === 'profile' ? '▲' : '▼'}</span>
            </button>
            {section === 'profile' && (
              <div style={{ margin: '0 20px 8px', background: '#0d0d0d', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#333', marginBottom: 10 }}>Display name</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    style={{ flex: 1, padding: '10px 14px', background: '#111', border: '1px solid #222', borderRadius: 8, color: '#fff', font: 'inherit', fontSize: 14, outline: 'none' }}
                  />
                  <button
                    onClick={async () => {
                      if (!displayName.trim()) return
                      try { await user.updateProfile?.({ displayName: displayName.trim() }) } catch(e) {}
                      setSection(null)
                    }}
                    style={{ padding: '10px 18px', background: 'var(--green)', border: 'none', borderRadius: 8, color: '#000', font: 'inherit', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                  >Save</button>
                </div>
              </div>
            )}

            {/* Settings — coming soon */}
            <div style={{ ...rowStyle, opacity: .35, cursor: 'default' }}>
              <div style={iconBox('#111')}>⚙️</div>
              <div style={{ flex: 1 }}>
                <div style={rowTitle}>Settings</div>
                <div style={rowSub}>Coming soon</div>
              </div>
            </div>

            <div style={{ height: 1, background: '#111', margin: '8px 0' }}/>

            {/* Sign out */}
            <button onClick={() => signOut(auth)} style={{ ...rowStyle, color: '#ff4444' }}>
              <div style={{ ...iconBox('#1a0000'), fontSize: 16 }}>→</div>
              <div style={rowTitle}>Sign out</div>
            </button>

          </div>

          {/* Safe area bottom */}
          <div style={{ height: 'env(safe-area-inset-bottom, 20px)', flexShrink: 0 }}/>
        </div>
      )}
    </>
  )
}

const rowStyle = {
  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
  padding: '12px 20px', background: 'none', border: 'none',
  cursor: 'pointer', textAlign: 'left',
}
const rowTitle = { fontSize: 15, fontWeight: 600, color: '#fff' }
const rowSub = { fontSize: 12, color: '#555', marginTop: 2 }
const iconBox = (bg) => ({
  width: 40, height: 40, borderRadius: 10, background: bg,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 18, flexShrink: 0,
})
