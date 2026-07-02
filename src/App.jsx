import { useState, useEffect } from 'react'
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth'
import { auth } from './lib/firebase'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import NavMenu from './components/NavMenu'

export default function App() {
  const [user, setUser] = useState(undefined)
  const [activePool, setActivePool] = useState(null)

  useEffect(() => {
    getRedirectResult(auth).then(r => { if (r?.user) setUser(r.user) }).catch(() => {})
    return onAuthStateChanged(auth, u => setUser(u || null))
  }, [])

  if (user === undefined) return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#000', color: '#333' }}>
      Loading…
    </div>
  )

  if (!user) return <Login />

  const invLink = activePool ? `${location.href.split('#')[0]}#join-${activePool}` : null

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div className="nav">
        <div className="nav-logo">In<em>The</em>League</div>
        <div className="nav-right">
          <NavMenu user={user} poolId={activePool} invLink={invLink} />
        </div>
      </div>
      <Dashboard user={user} onPoolChange={setActivePool} />
    </div>
  )
}
