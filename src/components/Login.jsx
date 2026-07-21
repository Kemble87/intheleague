import { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { auth } from '../lib/firebase'

// Styling is scoped under .itl-auth so it matches the landing without
// touching the app's global CSS. All auth logic below is unchanged.
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Inter:wght@400;500;600&display=swap');

.itl-auth {
  --ink:#0E120F; --chalk:#F6F5EF; --turf:#2CE86A; --turf-deep:#1E7D37;
  --muted:#8B928A; --line:#242a20; --field:#191d18; --field-line:#2b3227; --err:#FF6B7A;
  --display:"Archivo",system-ui,sans-serif; --body:"Inter",system-ui,sans-serif;
  min-height:100vh; width:100%;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding:40px 22px; position:relative; overflow:hidden;
  background:radial-gradient(120% 80% at 50% -10%, #1c2a1e 0%, var(--ink) 55%);
  font-family:var(--body); color:var(--chalk);
}
.itl-auth *{ box-sizing:border-box; margin:0; padding:0; }
.itl-auth::before{
  content:""; position:absolute; left:50%; top:-6%; width:620px; height:380px; transform:translateX(-50%);
  background:radial-gradient(closest-side, rgba(44,232,106,.10), transparent 70%); pointer-events:none;
}
.itl-auth::after{
  content:""; position:absolute; left:50%; top:6%; width:360px; height:360px; transform:translateX(-50%);
  border:1px solid rgba(246,245,239,.05); border-radius:50%; pointer-events:none;
}
.itl-auth > *{ position:relative; z-index:1; }

.itl-auth .auth-logo{ font-family:var(--display); font-weight:900; font-size:30px; letter-spacing:-.02em; color:var(--chalk); text-align:center; }
.itl-auth .auth-logo em{ color:var(--turf); font-style:normal; }
.itl-auth .auth-tag{ margin:6px 0 26px; text-align:center; font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }

.itl-auth .auth-box{
  width:100%; max-width:390px;
  background:linear-gradient(160deg,#181a20 0%, #131512 45%);
  border:1px solid var(--line); border-radius:20px; padding:26px 24px;
  box-shadow:0 40px 90px -30px rgba(0,0,0,.8), 0 0 70px -30px rgba(44,232,106,.18);
}
.itl-auth .auth-h{ font-family:var(--display); font-weight:800; font-size:26px; letter-spacing:-.01em; color:#fff; margin-bottom:5px; }
.itl-auth .auth-s{ font-size:14px; color:var(--muted); margin-bottom:20px; }

.itl-auth .g-btn{
  width:100%; display:flex; align-items:center; justify-content:center; gap:10px;
  background:#fff; color:#1a1a1a; font-family:var(--display); font-weight:700; font-size:15px;
  border:0; cursor:pointer; padding:13px; border-radius:12px; transition:transform .15s ease, opacity .15s ease;
}
.itl-auth .g-btn:hover{ transform:translateY(-1px); }
.itl-auth .g-btn:disabled{ opacity:.6; cursor:default; transform:none; }
.itl-auth .g-btn svg{ flex:none; }

.itl-auth .sep{ display:flex; align-items:center; gap:12px; margin:16px 0; font-size:12px; color:var(--muted); }
.itl-auth .sep::before, .itl-auth .sep::after{ content:""; flex:1; height:1px; background:var(--line); }

.itl-auth .inp{
  width:100%; background:var(--field); border:1px solid var(--field-line); border-radius:12px;
  padding:13px 14px; margin-bottom:11px; color:var(--chalk); font-family:var(--body); font-size:15px;
  transition:border-color .15s ease, box-shadow .15s ease;
}
.itl-auth .inp::placeholder{ color:#6d7269; }
.itl-auth .inp:focus{ outline:none; border-color:var(--turf); box-shadow:0 0 0 3px rgba(44,232,106,.15); }

.itl-auth .auth-err{ color:var(--err); font-size:13px; font-weight:500; margin:2px 0 12px; }

.itl-auth .cta{
  width:100%; background:var(--turf); color:#052610; font-family:var(--display); font-weight:800; font-size:16px;
  border:0; cursor:pointer; padding:14px; border-radius:12px; margin-top:5px;
  box-shadow:0 8px 26px -10px rgba(44,232,106,.55); transition:transform .15s ease, box-shadow .15s ease, opacity .15s ease;
}
.itl-auth .cta:hover{ transform:translateY(-1px); box-shadow:0 14px 32px -12px rgba(44,232,106,.65); }
.itl-auth .cta:disabled{ opacity:.65; cursor:default; transform:none; box-shadow:none; }

.itl-auth .auth-sw{ text-align:center; margin-top:16px; font-size:13px; color:var(--muted); }
.itl-auth .auth-sw button{ background:none; border:0; cursor:pointer; color:var(--chalk); font-weight:700; font-size:13px; text-decoration:underline; text-underline-offset:2px; padding:0; font-family:var(--body); }
.itl-auth .auth-sw button:hover{ color:var(--turf); }

@media (prefers-reduced-motion: reduce){
  .itl-auth *{ transition:none !important; }
}
`

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
        const issues = []
        if (pass.length < 8) issues.push('8+ characters')
        if (!/[A-Z]/.test(pass)) issues.push('an uppercase letter')
        if (!/[0-9]/.test(pass)) issues.push('a number')
        if (!/[^A-Za-z0-9]/.test(pass)) issues.push('a special character (like !)')
        if (issues.length) { setErr('Password needs ' + issues.join(', ') + '.'); setBusy(false); return }
        const c = await createUserWithEmailAndPassword(auth, email, pass)
        sendEmailVerification(c.user).catch(() => {})
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
    <div className="itl-auth">
      <style>{CSS}</style>
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
