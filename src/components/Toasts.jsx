import { useState, useEffect } from 'react'

const tone = msg => /error|fail|wrong|not found/i.test(msg) ? 'err'
  : /already|one chip|hold on|can't|cannot/i.test(msg) ? 'warn' : 'ok'

const COLORS = { ok: '#00E05A', warn: '#FFD60A', err: '#FF3B5C' }

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    window.alert = msg => {
      const id = Date.now() + Math.random()
      const text = String(msg).replace(/🏆/g, '').trim()
      setToasts(t => [...t.slice(-2), { id, text, tone: tone(text) }])
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3400)
    }
  }, [])

  if (!toasts.length) return null

  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none', padding: '0 16px' }}>
      <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(16px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: 11,
          maxWidth: 420, width: '100%',
          background: 'rgba(12,12,12,.92)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #232323',
          borderRadius: 14,
          padding: '13px 16px',
          boxShadow: '0 12px 40px rgba(0,0,0,.6)',
          animation: 'toastIn .28s cubic-bezier(.2,.9,.3,1.2) both',
        }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: COLORS[t.tone] + '1a', border: `1.5px solid ${COLORS[t.tone]}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {t.tone === 'ok'
              ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke={COLORS.ok} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <span style={{ color: COLORS[t.tone], fontSize: 12, fontWeight: 800, lineHeight: 1 }}>!</span>}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#eee', lineHeight: 1.45 }}>{t.text}</span>
        </div>
      ))}
    </div>
  )
}
