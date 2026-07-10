import { useState, useEffect } from 'react'
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth'
import { auth } from './lib/firebase'
import Landing from './components/Landing'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import SideDrawer from './components/SideDrawer'
import Backdrop from './components/Backdrop'
import Spectate from './components/Spectate'

import Toast from './components/Toast'

export default function App() {
  const [user, setUser] = useState(undefined)
  const [activePool, setActivePool] = useState(null)
  const [pools, setPools] = useState([])
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    getRedirectResult(auth).then(r => { if (r?.user) setUser(r.user) }).catch(() => {})
    return onAuthStateChanged(auth, u => setUser(u || null))
  }, [])

  // If arriving via an invite link, go straight to login
  useEffect(() => {
    if ((location.hash || '').startsWith('#join-')) setShowLogin(true)
  }, [])
  // Public spectator route — works signed in or out, no auth required
  const watchMatch = window.location.hash.match(/^#watch-(.+)$/)
  if (watchMatch) return <Spectate poolId={watchMatch[1]} />


  if (user === undefined) return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#000', color: '#333' }}>
      Loading…
    </div>
  )

  if (!user) {
    if (showLogin) return <Login />
    return <Landing onGetStarted={() => setShowLogin(true)} />
  }

  const invLink = activePool ? `https://intheleague.app#join-${activePool}` : null

  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
      <Backdrop />      <Toast />

      <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="nav">
        <div className="nav-logo">In<em>The</em>League</div>
        <div className="nav-right">
          <SideDrawer
            user={user}
            pools={pools}
            activePoolId={activePool}
            onSwitchPool={setActivePool}
            invLink={invLink}
          />
        </div>
      </div>
      <Dashboard
        user={user}
        onPoolChange={setActivePool}
        onPoolsChange={setPools}
      />
      </div>
    </div>
  )
}
