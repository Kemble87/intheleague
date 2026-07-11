import { useState } from 'react'
import { doc, updateDoc, deleteField, increment, deleteDoc } from 'firebase/firestore'
import { db, rtdb } from '../lib/firebase'
import { ref, remove } from 'firebase/database'

import { initials } from '../lib/helpers'

function MemberRow({ uid, member, isMe, canManage, poolId, onTransfer }) {
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(null)

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
            {isMe && <span style={{ fontSize:10, fontWeight:700, color:'var(--green)', background:'#001a0d', borderRadius:999, padding:'2px 7px' }}>YOU</span>}
            {member.isOrganiser && <span style={{ fontSize:10, fontWeight:700, color:'#FFD700', background:'#1a1400', borderRadius:999, padding:'2px 7px' }}>ORGANISER</span>}
          </div>
        </div>
        {canManage && !isMe && (
          <div style={{ display:'flex', gap:6, flexShrink:0 }}>
            <button onClick={() => setConfirming('remove')} style={{ padding:'6px 12px', background:'none', border:'1px solid #2a0000', borderRadius:8, color:'#ff4444', font:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              Remove
            </button>
            {!member.isOrganiser && (
              <button onClick={() => setConfirming('transfer')} style={{ padding:'6px 12px', background:'none', border:'1px solid #222', borderRadius:8, color:'#aaa', font:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                Make organiser
              </button>
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
  const members = Object.entries(pool.members || {})
  const isOrg = pool.createdBy === userId || pool.members?.[userId]?.isOrganiser

  async function transferOwnership(newOrgUid) {
    await updateDoc(doc(db, 'pools', poolId), {
      [`members.${newOrgUid}.isOrganiser`]: true,
      [`members.${userId}.isOrganiser`]: false,
      createdBy: newOrgUid
    })
  }

  return (
    <div style={{ marginBottom:20 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'#111', border:'1px solid #1a1a1a', borderRadius: open ? '12px 12px 0 0' : 12, color:'#fff', font:'inherit', fontSize:14, fontWeight:700, cursor:'pointer' }}>
        <span>👥 Players · {members.length}</span>
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
              canManage={isOrg}
              poolId={poolId}
              onTransfer={transferOwnership}
            />
          ))}
                    <DangerZone poolId={poolId} pool={pool} userId={userId} isOrg={isOrg} />

        </div>
      )}
    </div>
  )
}

function DangerZone({ poolId, pool, userId, isOrg }) {
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)

  async function deletePool() {
    setBusy(true)
    try {
      await remove(ref(rtdb, `pools/${poolId}`))
      await deleteDoc(doc(db, 'pools', poolId))
      alert('Pool deleted.')
      window.location.hash = ''
      window.location.reload()
    } catch (e) { alert('Could not delete pool: ' + e.message); setBusy(false) }
  }

  async function leavePool() {
    setBusy(true)
    try {
      await remove(ref(rtdb, `pools/${poolId}/picks/${userId}`))
      await updateDoc(doc(db, 'pools', poolId), {
        [`members.${userId}`]: deleteField(),
        memberCount: increment(-1),
      })
      alert('You have left the pool.')
      window.location.hash = ''
      window.location.reload()
    } catch (e) { alert('Could not leave pool: ' + e.message); setBusy(false) }
  }

  const btn = { flex: 1, padding: '10px 12px', background: 'none', border: '1px solid #3a1418', borderRadius: 10, color: '#FF3B5C', font: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer' }

  return (
    <div style={{ borderTop: '1px solid #161616', padding: '14px 0 16px', marginTop: 4 }}>
      {!confirm ? (
        <div style={{ display: 'flex', gap: 10 }}>
          {!isOrg && <button style={btn} onClick={() => setConfirm('leave')}>Leave this pool</button>}
          {isOrg && <button style={btn} onClick={() => setConfirm('delete')}>Delete this pool</button>}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 12.5, color: '#bbb', lineHeight: 1.6, marginBottom: 12 }}>
            {confirm === 'delete'
              ? `Delete "${pool.name}" for everyone? All picks, results and history are permanently erased. This cannot be undone.`
              : `Leave "${pool.name}"? Your picks are erased and you'll need a new invite to return.`}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ ...btn, color: '#888', border: '1px solid #222' }} onClick={() => setConfirm(null)} disabled={busy}>Cancel</button>
            <button style={{ ...btn, background: '#1a0508' }} onClick={confirm === 'delete' ? deletePool : leavePool} disabled={busy}>
              {busy ? 'Working…' : confirm === 'delete' ? 'Yes, delete forever' : 'Yes, leave'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

