import { useState, useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { initials } from '../lib/helpers'

export default function NavMenu({ user, poolId, invLink }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="menu-wrap" ref={ref}>
      <button className="menu-trigger" onClick={() => setOpen(o => !o)}>
        {initials(user.displayName || user.email)}
      </button>
      {open && (
        <div className="menu-drop">
          <div className="menu-head">
            <div className="menu-head-name">{user.displayName || (user.email || '').split('@')[0]}</div>
            <div className="menu-head-email">{user.email}</div>
          </div>
          {poolId && invLink && (
            <>
              <button className="menu-item" onClick={() => { navigator.clipboard?.writeText(invLink); setOpen(false) }}>
                <span className="menu-icon">👥</span>
                <div>
                  <div>Invite players</div>
                  <div className="menu-pool-code">{poolId}</div>
                </div>
              </button>
              <div className="menu-sep" />
            </>
          )}
          <button className="menu-item danger" onClick={() => signOut(auth)}>
            <span className="menu-icon">→</span>
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
