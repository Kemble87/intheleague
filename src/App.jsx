import { useState, useEffect } from 'react'
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth'
import { auth } from './lib/firebase'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import SideDrawer from './components/SideDrawer'

export default function App() {
  const [user, setUser] = useState(undefined)
  const [activePool, setActivePool] = useState(null)
  const [pools, setPools] = useState([])

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
  )
}
