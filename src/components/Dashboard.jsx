import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, doc, setDoc, arrayUnion, updateDoc, increment, getDoc } from 'firebase/firestore'
import { db, rtdb } from '../lib/firebase'
import { ref, get } from 'firebase/database'
import { SPORTS, ACCENTS } from '../lib/constants'

import { slugify, initials, fetchAndStoreFixtures } from '../lib/helpers'

import PoolView from './PoolView'

function CreateModal({ user, onClose, onCreate }) {
  const [name, setName] = useState('')
    const [sport, setSport] = useState('PL')
  const [accent, setAccent] = useState(ACCENTS[0])

  const [busy, setBusy] = useState(false)
  const [code, setCode] = useState(null)

  async function create() {
    if (!name.trim()) return
    setBusy(true)
    const id = slugify(name)
    await setDoc(doc(db, 'pools', id), {
            name: name.trim(), sport, accent, code: id,

      createdBy: user.uid, createdAt: Date.now(),
      members: { [user.uid]: { name: user.displayName || user.email, joinedAt: Date.now(), isOrganiser: true } },
      memberCount: 1,
    })
    await setDoc(doc(db, 'users', user.uid), { pools: arrayUnion(id) }, { merge: true })
        fetchAndStoreFixtures(sport, id, rtdb).catch(() => {})
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
          <div className="modal-h">Pool created</div>
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
            <div key={k} className={`sport-tile${sport === k ? ' on' : ''}`}
              onClick={() => !s.soon && setSport(k)}
              style={s.soon ? { opacity: .35, cursor: 'default', position: 'relative' } : undefined}>
              <div className="sport-tile-em">{s.emoji}</div>
              <div className="sport-tile-name">{s.name}</div>
              {s.soon && <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '.12em', color: '#FFD60A', marginTop: 3 }}>COMING SOON</div>}
            </div>
          ))}
        </div>
                <label className="modal-label" style={{ marginTop: 16 }}>Pool colour</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
          {ACCENTS.map(c => (
            <button key={c} onClick={() => setAccent(c)} aria-label={`Colour ${c}`} style={{
              width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', background: c,
              border: accent === c ? '3px solid #fff' : '3px solid transparent',
              outline: accent === c ? `2px solid ${c}` : 'none',
              transition: 'transform .15s', transform: accent === c ? 'scale(1.1)' : 'scale(1)',
            }}/>
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
  const [meta, setMeta] = useState({})

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

  useEffect(() => {
    if (!pools.length) return
    let dead = false
    ;(async () => {
      const out = {}
      for (const p of pools) {
        try {
          const [fs, ps] = await Promise.all([
            get(ref(rtdb, `pools/${p.id}/fixtures`)),
            get(ref(rtdb, `pools/${p.id}/picks/${user.uid}`)),
          ])
          if (!fs.exists()) continue
          const fx = Object.values(fs.val()).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
          const picks = ps.exists() ? ps.val() : {}
          const now = Date.now()
          const next = fx.find(f => new Date(f.kickoff).getTime() > now)
          if (!next) { out[p.id] = { done: true }; continue }
          const md = next.matchday
          const due = fx.filter(f => String(f.matchday) === String(md) && new Date(f.kickoff).getTime() > now && picks[f.id]?.h == null).length
          // My league position — quick chip-free approximation for the card
          let rank = null
          try {
            const [rs, ap] = await Promise.all([
              get(ref(rtdb, `pools/${p.id}/results`)),
              get(ref(rtdb, `pools/${p.id}/picks`)),
            ])
            const results = rs.exists() ? rs.val() : {}
            const allPicks = ap.exists() ? ap.val() : {}
            const memberIds = Object.keys(p.members || {})
            if (memberIds.length > 1 && Object.keys(results).length) {
              const score = uid => fx.reduce((s2, f) => {
                const pk = (allPicks[uid] || {})[f.id], r = results[f.id]
                if (!pk || !r || pk.h == null || r.h == null) return s2
                if (pk.h === r.h && pk.a === r.a) return s2 + 3
                if (Math.sign(pk.h - pk.a) === Math.sign(r.h - r.a)) return s2 + 1
                return s2
              }, 0)
              const table = memberIds.map(uid => ({ uid, pts: score(uid) })).sort((a, b) => b.pts - a.pts)
              rank = table.findIndex(t => t.uid === user.uid) + 1
            }
          } catch (e) { /* rank optional */ }
          const ko = new Date(next.kickoff)
          const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(ko).reduce((a, b) => (a[b.type] = b.value, a), {})
          out[p.id] = { due, rank, players: Object.keys(p.members || {}).length, nextKO: `${parts.weekday} ${parts.day} ${parts.month} · ${parts.hour}:${parts.minute}` }
        } catch (e) { /* meta is decoration — never block the dashboard */ }
      }
      if (!dead) setMeta(out)
    })()
    return () => { dead = true }
  }, [pools, user.uid])
  const autoOpened = useState({ done: false })[0]
  useEffect(() => {
    if (autoOpened.done || loading || pools.length !== 1 || active) return
    if ((location.hash || '').startsWith('#join-')) return
    autoOpened.done = true
    goPool(pools[0].id)
  }, [loading, pools, active])

  function goPool(id) { setActive(id); onPoolChange?.(id) }
  function goBack() { autoOpened.done = true; setActive(null); onPoolChange?.(null) }

  
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
        <div className="dash-greeting">{new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, <em>{first}</em>.</div>
        <div className="dash-sub">Pick your scores. Beat your mates.</div>
      </div>
      {pools.length > 0 && (
        <div className="pro-strip">
          <div className="pro-strip-icon" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 1L3 9.5h4L7 15l6-8.5H9L9 1z" stroke="#00E05A" strokeWidth="1.3" strokeLinejoin="round"/></svg>
          </div>
          <div className="pro-strip-text">
            <div className="pro-strip-title">Season one · free for everyone</div>
            <div className="pro-strip-sub">Every feature unlocked for founding pools</div>
          </div>
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
                <div className="pool-card-grad" style={{ borderTop: pool.accent ? `2px solid ${pool.accent}` : undefined, background: ({

                  PL:    'linear-gradient(150deg,#12081f 0%,#0d0d0d 60%)',
                  CHAMP: 'linear-gradient(150deg,#081120 0%,#0d0d0d 60%)',
                  L1:    'linear-gradient(150deg,#081408 0%,#0d0d0d 60%)',
                  WC:    'linear-gradient(150deg,#1a0f05 0%,#0d0d0d 60%)',
                  SN:    'linear-gradient(150deg,#081408 0%,#0d0d0d 60%)',
                })[pool.sport] || 'linear-gradient(150deg,#12081f 0%,#0d0d0d 60%)' }}>
                  <div className="pool-card-sport" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="pool-card-sport-dot" />{s.name}</span>
                    {meta[pool.id]?.due > 0 && (
                      <span style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#FFD60A', background: 'rgba(255,214,10,.1)', border: '1px solid rgba(255,214,10,.35)', borderRadius: 500, padding: '3px 10px' }}>
                        {meta[pool.id].due} pick{meta[pool.id].due !== 1 ? 's' : ''} due
                      </span>
                    )}
                    {meta[pool.id]?.due === 0 && (
                      <span style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#00E05A', background: 'rgba(0,224,90,.08)', border: '1px solid rgba(0,224,90,.3)', borderRadius: 500, padding: '3px 10px' }}>
                        All picked
                      </span>
                    )}
                  </div>
                  <div className="pool-card-name">{pool.name}</div>
                  {meta[pool.id]?.nextKO && (
                    <div style={{ fontFamily: "'Share Tech Mono',ui-monospace,monospace", fontSize: 10, letterSpacing: '.1em', color: 'rgba(255,255,255,.35)', marginTop: 6 }}>
                      NEXT KICKOFF · {meta[pool.id].nextKO.toUpperCase()}
                    </div>
                  )}
                  {meta[pool.id]?.rank && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, background: 'rgba(255,214,10,.08)', border: '1px solid rgba(255,214,10,.3)', borderRadius: 500, padding: '4px 12px' }}>
                      <svg width="10" height="8" viewBox="0 0 12 9" fill="none"><path d="M1 8h10M1 8L.5 2.5 3.5 5 6 1l2.5 4 3-2.5L11 8" stroke="#FFD60A" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round"/></svg>
                      <span style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 11, fontWeight: 700, color: '#FFD60A' }}>
                        You're {meta[pool.id].rank}{['','st','nd','rd'][meta[pool.id].rank % 100 > 10 && meta[pool.id].rank % 100 < 14 ? 0 : meta[pool.id].rank % 10] || 'th'} of {meta[pool.id].players}
                      </span>
                    </div>
                  )}
                  <div className="pool-card-players" style={{ marginTop: 14 }}>
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
