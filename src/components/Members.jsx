import { useState } from 'react'
import { doc, updateDoc, deleteField, increment } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { initials } from '../lib/helpers'

function MemberRow({ uid, member, isMe, isOrg, canManage, poolId, onTransfer }) {
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(null) // 'remove' | 'transfer'

  async function removeMember() {
    setBusy(true)
    await updateDoc(doc(db, 'pools', poolId), {
      [`members.${uid}`]: deleteField(),
      memberCount: increment(-1)
    })
    setBusy(false)
    setConfirming(null)
  }

  async function transferOwnership() {
    setBusy(true)
    await onTransfer(uid)
    setBusy(false)
    setConfirming(null)
  }

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #111' }}>
        <div style={{ width:36, height:36, borderRadius:'50%', background: isMe ? 'var(--green)' : '#1a1a1a', color: isMe ? '#000' : '#555', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 }}>
          {initials(member.name)}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:6 }}>
            {member.name || 'Unknown'}
            {isMe && <span style={{ fontSize:10, fontWeight:700, color:'var(--green)', background:'#001a0d', borderRadius:999, padding:'2px 7px', letterSpacing:'.06em' }}>YOU</span>}
            {member.isOrganiser && <span style={{ fontSize:10, fontWeight:700, color:'#FFD700', background:'#1a1400', borderRadius:999, padding:'2px 7px', letterSpacing:'.06em' }}>ORGANISER</span>}
          </div>
          <div style={{ fontSize:11, color:'#444', marginTop:2 }}>{member.email || ''}</div>
        </div>
        {canManage && !isMe && (
          <div style={{ display:'flex', gap:6', flexShrink:0 }}>
            <button
              onClick={() => setConfirming('remove')}
              style={{ padding:'6px 12px', background:'none', border:'1px solid #2a0000', borderRadius:8, color:'#ff4444', font:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}
            >Remove</button>
            {!member.isOrganiser && (
              <button
                onClick={() => setConfirming('transfer')}
                style={{ padding:'6px 12px', background:'none', border:'1px solid #222', borderRadius:8, color:'#aaa', font:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}
              >Make organiser</button>
            )}
          </div>
        )}
      </div>

      {confirming === 'remove' && (
        <div style={{ background:'#0d0000', border:'1px solid #330000', borderRadius:8, padding:'12px 14px', marginBottom:8 }}>
          <div style={{ fontSize:13, color:'#fff', marginBottom:10 }}>Remove <strong>{member.name}</strong> from this pool?</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => setConfirming(null)} style={{ flex:1, padding:'8px', background:'#1a1a1a', border:'none', borderRadius:500, color:'#aaa', font:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button onClick={removeMember} disabled={busy} style={{ flex:2, padding:'8px', background:'#CC0000', border:'none', borderRadius:500, color:'#fff', font:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>{busy ? 'Removing…' : 'Yes, remove'}</button>
          </div>
        </div>
      )}

      {confirming === 'transfer' && (
        <div style={{ background:'#0d0a00', border:'1px solid #332200', borderRadius:8, padding:'12px 14px', marginBottom:8 }}>
          <div style={{ fontSize:13, color:'#fff', marginBottom:4 }}>Make <strong>{member.name}</strong> the organiser?</div>
          <div style={{ fontSize:12, color:'#555', marginBottom:10 }}>You'll become a regular member. This can't be undone without them transferring it back.</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => setConfirming(null)} style={{ flex:1, padding:'8px', background:'#1a1a1a', border:'none', borderRadius:500, color:'#aaa', font:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}>Cancel</button>
            <button onClick={transferOwnership} disabled={busy} style={{ flex:2, padding:'8px', background:'#FFD700', border:'none', borderRadius:500, color:'#000', font:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>{busy ? 'Transferring…' : 'Yes, transfer'}</button>
          </div>
        </div>
      )}
    </>
  )
}

export default function Members({ poolId, pool, userId }) {
  const [open, setOpen] = useState(false)
  const isOrg = pool.createdBy === userId || pool.members?.[userId]?.isOrganiser
  const members = Object.entries(pool.members || {})

  async function transferOwnership(newOrgUid) {
    // Make new user organiser, remove organiser from current user
    await updateDoc(doc(db, 'pools', poolId), {
      [`members.${newOrgUid}.isOrganiser`]: true,
      [`members.${userId}.isOrganiser`]: false,
      createdBy: newOrgUid
    })
  }

  return (
    <div style={{ marginBottom:20 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'#111', border:'1px solid #1a1a1a', borderRadius:12, color:'#fff', font:'inherit', fontSize:14, fontWeight:700, cursor:'pointer', marginBottom: open ? 0 : 0 }}
      >
        <span>👥 Members · {members.length}</span>
        <span style={{ color:'#444', fontSize:12 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ background:'#0d0d0d', border:'1px solid #1a1a1a', borderTop:'none', borderRadius:'0 0 12px 12px', padding:'0 16px' }}>
          {members.map(([uid, member]) => (
            <MemberRow
              key={uid}
              uid={uid}
              member={member}
              isMe={uid === userId}
              isOrg={member.isOrganiser || pool.createdBy === uid}
              canManage={isOrg}
              poolId={poolId}
              onTransfer={transferOwnership}
            />
          ))}
          {isOrg && (
            <div style={{ padding:'12px 0' }}>
              <button
                onClick={() => navigator.clipboard?.writeText(`${location.href.split('#')[0]}#join-${poolId}`)}
                style={{ width:'100%', padding:'10px', background:'none', border:'1px solid #222', borderRadius:8, color:'#aaa', font:'inherit', fontSize:13, fontWeight:600, cursor:'pointer' }}
              >
                📋 Copy invite link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
