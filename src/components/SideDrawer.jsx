import { useState, useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { initials } from '../lib/helpers'
import { SPORTS } from '../lib/constants'

const SCORING_RULES = [
  { pts: 3, label: 'Exact score', eg: 'You pick 2–1, result is 2–1' },
  { pts: 1, label: 'Correct result', eg: 'You pick 2–1, result is 3–0 (both home wins)' },
  { pts: 0, label: 'Wrong', eg: 'You pick 2–1, result is 0–1' },
]

export default function SideDrawer({ user, pools, activePoolId, onSwitchPool, invLink }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState(null) // 'rules' | 'profile'
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const drawerRef = useRef(null)

  // Close on outside tap
  useEffect(() => {
    function handler(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const activePool = pools?.find(p => p.id === activePoolId)

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--green)', color: '#000',
          border: 'none', font: 'inherit', fontSize: 13, fontWeight: 800,
          cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 0, position: 'relative'
        }}
        aria-label="Open menu"
      >
        {initials(user?.displayName || user?.email)}
        <span style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 14, height: 14, borderRadius: '50%',
          background: '#000', border: '1.5px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <rect y="0" width="8" height="1.2" rx=".6" fill="#fff"/>
            <rect y="2.4" width="8" height="1.2" rx=".6" fill="#fff"/>
            <rect y="4.8" width="8" height="1.2" rx=".6" fill="#fff"/>
          </svg>
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
            zIndex: 900, backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn .2s ease'
          }}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(320px, 85vw)',
          background: '#0d0d0d',
          borderLeft: '1px solid #1a1a1a',
          zIndex: 901,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .3s cubic-bezier(.25,.46,.45,.94)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#333' }}>Menu</div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--green)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
              {initials(user?.displayName || user?.email)}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{user?.displayName || user?.email?.split('@')[0]}</div>
              <div style={{ fontSize: 12, color: '#444', marginTop: 2 }}>{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Switch Pool */}
        {pools?.length > 0 && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #111' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#333', marginBottom: 10 }}>Your pools</div>
            {pools.map(pool => {
              const s = SPORTS[pool.sport] || SPORTS.PL
              const isActive = pool.id === activePoolId
              return (
                <button
                  key={pool.id}
                  onClick={() => { onSwitchPool(pool.id); setOpen(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                    background: isActive ? '#1a1a1a' : 'none',
                    border: isActive ? '1px solid #222' : '1px solid transparent',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{s.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pool.name}</div>
                    <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>{s.name}</div>
                  </div>
                  {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }}/>}
                </button>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div style={{ padding: '12px 20px', flex: 1 }}>

          {/* Invite */}
          {activePool && invLink && (
            <button
              onClick={() => { navigator.clipboard?.writeText(invLink); setOpen(false) }}
              style={menuItemStyle}
            >
              <span style={menuIconStyle}>👥</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Invite players</div>
                <div style={{ fontSize: 11, color: '#444', marginTop: 1, fontFamily: 'ui-monospace,monospace', letterSpacing: '.04em' }}>{activePoolId}</div>
              </div>
            </button>
          )}

          {/* Rules */}
          <button onClick={() => setSection(section === 'rules' ? null : 'rules')} style={menuItemStyle}>
            <span style={menuIconStyle}>📋</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Scoring rules</div>
            </div>
            <span style={{ color: '#333', fontSize: 12 }}>{section === 'rules' ? '▲' : '▼'}</span>
          </button>
          {section === 'rules' && (
            <div style={{ background: '#111', borderRadius: 10, padding: '12px 14px', marginBottom: 4 }}>
              {SCORING_RULES.map(r => (
                <div key={r.pts} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: r.pts === 3 ? '#0d2b19' : r.pts === 1 ? '#221f00' : '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: r.pts === 3 ? 'var(--green)' : r.pts === 1 ? 'var(--gold)' : '#333', flexShrink: 0 }}>
                    {r.pts === 0 ? '✕' : '+' + r.pts}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{r.eg}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Profile */}
          <button onClick={() => setSection(section === 'profile' ? null : 'profile')} style={menuItemStyle}>
            <span style={menuIconStyle}>👤</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Profile</div>
            </div>
            <span style={{ color: '#333', fontSize: 12 }}>{section === 'profile' ? '▲' : '▼'}</span>
          </button>
          {section === 'profile' && (
            <div style={{ background: '#111', borderRadius: 10, padding: '12px 14px', marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>Display name</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  style={{ flex: 1, padding: '9px 12px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 8, color: '#fff', font: 'inherit', fontSize: 14, outline: 'none' }}
                  placeholder="Your name"
                />
                <button
                  onClick={async () => {
                    if (!displayName.trim()) return
                    await user.updateProfile?.({ displayName: displayName.trim() })
                    setSection(null)
                  }}
                  style={{ padding: '9px 16px', background: 'var(--green)', border: 'none', borderRadius: 8, color: '#000', font: 'inherit', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Settings — placeholder for future */}
          <button style={{ ...menuItemStyle, opacity: .4, cursor: 'not-allowed' }}>
            <span style={menuIconStyle}>⚙️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Settings</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>Coming soon</div>
            </div>
          </button>

        </div>

        {/* Sign out */}
        <div style={{ padding: '12px 20px 32px', borderTop: '1px solid #111' }}>
          <button
            onClick={() => signOut(auth)}
            style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid #2a0000', borderRadius: 10, color: '#ff4444', font: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <span>→</span> Sign out
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </>
  )
}

const menuItemStyle = {
  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
  padding: '11px 12px', borderRadius: 10, marginBottom: 4,
  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
  transition: 'background .1s',
}

const menuIconStyle = {
  fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0,
}
