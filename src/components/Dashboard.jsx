import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, doc, setDoc, arrayUnion, updateDoc, increment, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { SPORTS } from '../lib/constants'
import { slugify, initials } from '../lib/helpers'
import PoolView from './PoolView'

function CreateModal({ user, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [sport, setSport] = useState('PL')
  const [busy, setBusy] = useState(false)
  const [code, setCode] = useState(null)

  async function create() {
    if (!name.trim()) return
    setBusy(true)
    const id = slugify(name)
    await setDoc(doc(db, 'pools', id), {
      name: name.trim(), sport, code: id,
      createdBy: user.uid, createdAt: Date.now(),
      members: { [user.uid]: { name: user.displayName || user.email, joinedAt: Date.now(), isOrganiser: true } },
      memberCount: 1,
    })
    await setDoc(doc(db, 'users', user.uid), { pools: arrayUnion(id) }, { merge: true })
    setCode(id)
    onCreate(id)
    setBusy(false)
  }

  if (code) {
    const link = `${location.href.split('#')[0]}#join-${code}`
    return (
      <div className="modal-bg" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-pip" />
          <div className="modal-h">Pool created 🎉</div>
          <div className="modal-s">Share this link — they join in one tap.</div>
          <div className="inv-box">
            <span className="inv-code">{code}</span>
            <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(link)}>Copy link</button>
          </div>
          <button className="cta" onClick={onClose}>Start picking →</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-pip" />
        <div className="modal-h">Create a pool</div>
        <div className="modal-s">Name your pool, pick the sport, share the link.</div>
        <label className="modal-label">Pool name</label>
        <input className="inp" placeholder='"The Lads" or "Office League"' value={name} onChange={e => setName(e.target.value)} autoFocus style={{ marginBottom: 16 }} />
        <label className="modal-label">Sport</label>
        <div className="sport-grid">
          {Object.entries(SPORTS).map(([k, s]) => (
            <div key={k} className={`sport-tile${sport === k ? ' on' : ''}`} onClick={() => setSport(k)}>
              <div className="sport-tile-em">{s.emoji}</div>
              <div className="sport-tile-name">{s.name}</div>
            </div>
          ))}
        </div>
        <div className="modal-btns">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-green" onClick={create} disabled={!name.trim() || busy}>{busy ? 'Creating…' : 'Create pool'}</button>
        </div>
      </div>
    </div>
  )
}

function JoinModal({ user, onClose, onJoin }) {
  const [code, setCode] = useState((location.hash || '').replace(/^#join-/, ''))
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function join() {
    const c = code.trim().toLowerCase()
    if (!c) return
    setBusy(true); setErr('')
    try {
      const snap = await getDoc(doc(db, 'pools', c))
      if (!snap.exists()) { setErr('Pool not found — check the code.'); setBusy(false); return }
      if (!snap.data().members?.[user.uid]) {
        await updateDoc(doc(db, 'pools', c), {
          [`members.${user.uid}`]: { name: user.displayName || user.email, joinedAt: Date.now(), isOrganiser: false },
          memberCount: increment(1)
        })
        await setDoc(doc(db, 'users', user.uid), { pools: arrayUnion(c) }, { merge: true })
      }
      onJoin(c); onClose()
    } catch (e) { setErr('Something went wrong.') }
    setBusy(false)
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-pip" />
        <div className="modal-h">Join a pool</div>
        <div className="modal-s">Paste the code your organiser sent.</div>
        <label className="modal-label">Pool code</label>
        <input className="inp" placeholder="e.g. the-lads-x4f" value={code} onChange={e => setCode(e.target.value.replace(/.*#join-/, ''))} onKeyDown={e => e.key === 'Enter' && join()} autoFocus={!code} style={{ marginBottom: err ? 8 : 16 }} />
        {err && <div className="field-err">{err}</div>}
        <div className="modal-btns">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-green" onClick={join} disabled={!code.trim() || busy}>{busy ? 'Joining…' : 'Join pool'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ user, onPoolChange, onPoolsChange }) {
  const [pools, setPools] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [active, setActive] = useState(null)

  const first = (user.displayName || user.email || '').split(/[\s@]/)[0]

  useEffect(() => {
    if ((location.hash || '').startsWith('#join-')) setShowJoin(true)
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'pools'), where(`members.${user.uid}.joinedAt`, '>=', 0))
    const unsub = onSnapshot(q,
      s => { const p = s.docs.map(d => ({ id: d.id, ...d.data() })); setPools(p); onPoolsChange?.(p); setLoading(false) },
      () => {
        getDoc(doc(db, 'users', user.uid)).then(s => {
          const codes = s.data()?.pools || []
          if (!codes.length) { setLoading(false); return }
          Promise.all(codes.map(c => getDoc(doc(db, 'pools', c)))).then(snaps => {
            const p2 = snaps.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() })); setPools(p2); onPoolsChange?.(p2)
            setLoading(false)
          })
        })
      }
    )
    return () => unsub?.()
  }, [user.uid])

  function goPool(id) { setActive(id); onPoolChange?.(id) }
  function goBack() { setActive(null); onPoolChange?.(null) }

  if (active) {
    const pool = pools.find(p => p.id === active)
    if (pool) return (
      <div className="main">
        <PoolView user={user} pool={pool} poolId={active} onBack={goBack} />
      </div>
    )
  }

  return (
    <div className="main">
      <div className="dash-hero">
        <div className="dash-greeting">Hey, <em>{first}</em></div>
        <div className="dash-sub">Pick your scores. Beat your mates.</div>
      </div>
      {pools.length > 0 && (
        <div className="pro-strip">
          <div className="pro-strip-icon" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 1L3 9.5h4L7 15l6-8.5H9L9 1z" stroke="#00E05A" strokeWidth="1.3" strokeLinejoin="round"/></svg>
          </div>
          <div className="pro-strip-text">
            <div className="pro-strip-title">Season Pass · £14.99</div>
            <div className="pro-strip-sub">One payment covers your whole pool · all season</div>
          </div>
          <button className="pro-strip-btn">Upgrade</button>
        </div>
      )}
      <div className="sec-label">Your pools</div>
      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <>
          {pools.length === 0 && (
            <div className="empty">
                            <div className="empty-title">No pools yet</div>
              <div className="empty-body">Create your first pool or join one a mate has set up.</div>
            </div>
          )}
          {pools.map(pool => {
            const s = SPORTS[pool.sport] || SPORTS.PL
            const mlist = Object.entries(pool.members || {})
            return (
              <div key={pool.id} className="pool-card" onClick={() => goPool(pool.id)}>
                <div className="pool-card-grad" style={{ background: ({
                  PL:    'linear-gradient(150deg,#12081f 0%,#0d0d0d 60%)',
                  CHAMP: 'linear-gradient(150deg,#081120 0%,#0d0d0d 60%)',
                  L1:    'linear-gradient(150deg,#081408 0%,#0d0d0d 60%)',
                  WC:    'linear-gradient(150deg,#1a0f05 0%,#0d0d0d 60%)',
                  SN:    'linear-gradient(150deg,#081408 0%,#0d0d0d 60%)',
                })[pool.sport] || 'linear-gradient(150deg,#12081f 0%,#0d0d0d 60%)' }}>
                  <div className="pool-card-sport">
                    <span className="pool-card-sport-dot" />
                    {s.name}
                  </div>
                  <div className="pool-card-name">{pool.name}</div>
                  <div className="pool-card-players">
                    {mlist.slice(0, 5).map(([uid, m]) => (
                      <div key={uid} className="player-av" title={m.name}>{initials(m.name)}</div>
                    ))}
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginLeft: 4 }}>
                      {mlist.length} player{mlist.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="pool-card-arrow">›</div>
              </div>
            )
          })}
          <button className="btn-create" style={{ marginTop: pools.length ? 12 : 0 }} onClick={() => setShowCreate(true)}>
            + Create a pool
          </button>
          <button className="btn-join" onClick={() => setShowJoin(true)}>Join with a code</button>
        </>
      )}
      {showCreate && <CreateModal user={user} onClose={() => setShowCreate(false)} onCreate={id => { goPool(id); setShowCreate(false) }} />}
      {showJoin && <JoinModal user={user} onClose={() => { setShowJoin(false); location.hash = '' }} onJoin={id => goPool(id)} />}
    </div>
  )
}
