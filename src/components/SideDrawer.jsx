import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { initials } from '../lib/helpers'
import { SPORTS } from '../lib/constants'

const SCORING_RULES = [
  { pts: 3, label: 'Exact score', eg: 'Pick 2–1, result is 2–1', color: '#1DB954' },
  { pts: 1, label: 'Correct result', eg: 'Pick 2–1, result is 3–0 (both home wins)', color: '#FFD60A' },
  { pts: 0, label: 'Wrong', eg: 'Pick 2–1, result is 0–1', color: '#444' },
]

const CHIP_RULES = [
  { emoji:'⚡', name:'2× Multiplier',  desc:'All your points for one matchday are doubled.', color:'#FFD700' },
  { emoji:'🏦', name:'Banker',          desc:'One match scores triple points. A +3 exact becomes +9.', color:'#4499FF' },
  { emoji:'⏱', name:'Half Time Hero',  desc:'Change all your picks at half time for one matchday.', color:'#9966FF' },
  { emoji:'🐱', name:'Copycat',         desc:"Copy another player's picks for a matchday silently.", color:'#00CCDD' },
  { emoji:'🎟', name:'Coupon Buster',   desc:'Your worst result of a matchday is rescued — upgraded to the next points tier (0→1, 1→3).', color:'#4CAF50' },
]

export default function SideDrawer({ user, pools, activePoolId, onSwitchPool, invLink }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState(null)
  const [displayName, setDisplayName] = useState(user?.displayName || '')

  useEffect(() => {
    if (!open) setSection(null)
  }, [open])

  const activePool = pools?.find(p => p.id === activePoolId)

  return (
    <>
      {/* Trigger — initials avatar */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--green)', color: '#000',
          border: 'none', font: 'inherit', fontSize: 13, fontWeight: 800,
          cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}
      >
        {initials(user?.displayName || user?.email)}
        <span style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 14, height: 14, borderRadius: '50%',
          background: '#0d0d0d', border: '1.5px solid #111',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="8" height="6" viewBox="0 0 8 6">
            <rect y="0" width="8" height="1.2" rx=".6" fill="#fff"/>
            <rect y="2.4" width="8" height="1.2" rx=".6" fill="#fff"/>
            <rect y="4.8" width="8" height="1.2" rx=".6" fill="#fff"/>
          </svg>
        </span>
      </button>

      {/* Full screen overlay */}
      {open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          width: '100vw', height: '100vh',
          zIndex: 1000,
          display: 'flex', flexDirection: 'column',
          background: '#0d0d0d',
          overflowY: 'auto',
          overflowX: 'hidden',
          animation: 'drawerIn .25s cubic-bezier(.25,.46,.45,.94)',
        }}>
          <style>{`