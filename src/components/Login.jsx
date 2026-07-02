import { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function Login() {
  const [mode, setMode] = useState('in')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function google() {
    setErr(''); setBusy(true)
    try { await signInWithPopup(auth, new GoogleAuthProvider()) }
    catch (e) { setErr(e.message) }
    setBusy(false)
  }

  async function submit() {
    setErr(''); setBusy(true)
    try {
      if (mode === 'up') {
        const c = await createUserWithEmailAndPassword(auth, email, pass)
        await updateProfile(c.user, { displayName: name })
      } else {
        await signInWithEmailAndPassword(auth, email, pass)
      }
    } catch (e) {
      setErr(e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found' ? 'Wrong email or password' : e.message)
    }
    setBusy(false)
  }

  return (
    <div className="auth">
      <div className="auth-logo">In<em>The</em>League</div>
      <div className="auth-tag">Your group · Your league · Your rules</div>
      <div className="auth-box">
        <div className="auth-h">{mode === 'in' ? 'Welcome back' : 'Create account'}</div>
        <div className="auth-s">{mode === 'in' ? 'Sign in to your pools' : 'Free to start — no card needed'}</div>
        <button className="g-btn" onClick={google} disabled={busy}>
          <svg width={18} height={18} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <div className="sep">or</div>
        {mode === 'up' && <input className="inp" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />}
        <input className="inp" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="inp" type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        {err && <div className="auth-err">{err}</div>}
        <button className="cta" onClick={submit} disabled={busy}>{busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'}</button>
        <div className="auth-sw">
          {mode === 'in' ? 'No account? ' : 'Have an account? '}
          <button onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr('') }}>
            {mode === 'in' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
