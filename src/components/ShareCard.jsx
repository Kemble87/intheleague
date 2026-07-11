import { useState, useMemo } from 'react'
import { matchdayScores } from '../lib/helpers'

// Renders a matchday results card to a canvas and shares/downloads it.
export default function ShareCard({ pool, members, fixtures, results, allPicks, allChips, userPicks, userId }) {
  const [busy, setBusy] = useState(false)

  // Latest completed matchday
  const lastMd = useMemo(() => {
    const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), { ...allPicks, [userId]: userPicks }, allChips)
    const done = Object.entries(mds).filter(([, v]) => v.complete).map(([md]) => Number(md)).sort((a, b) => b - a)
    return done[0] ?? null
  }, [fixtures, results, members, allPicks, allChips, userPicks, userId])

  if (lastMd == null || members.length < 2) return null

  async function generate() {
    setBusy(true)
    try {
      const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), { ...allPicks, [userId]: userPicks }, allChips)
      const scores = Object.entries(mds[lastMd].scores)
        .map(([uid, pts]) => ({ name: (pool.members?.[uid]?.name || '?').split(' ')[0], pts }))
        .sort((a, b) => b.pts - a.pts)

      const W = 1080, H = 1350
      const c = document.createElement('canvas')
      c.width = W; c.height = H
      const x = c.getContext('2d')

      // Background
      x.fillStyle = '#050505'; x.fillRect(0, 0, W, H)
      // Floodlight glows
      let g = x.createRadialGradient(W * .15, 0, 0, W * .15, 0, 700)
      g.addColorStop(0, 'rgba(200,220,255,.10)'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.fillRect(0, 0, W, H)
      g = x.createRadialGradient(W * .5, H, 0, W * .5, H, 900)
      g.addColorStop(0, 'rgba(0,224,90,.09)'); g.addColorStop(1, 'transparent')
      x.fillStyle = g; x.fillRect(0, 0, W, H)
      // Pitch circle
      x.strokeStyle = 'rgba(255,255,255,.05)'; x.lineWidth = 3
      x.beginPath(); x.arc(W / 2, 180, 340, 0, Math.PI * 2); x.stroke()
      x.beginPath(); x.moveTo(0, 180); x.lineTo(W, 180); x.stroke()

      // Header
      x.textAlign = 'center'
      x.fillStyle = '#00E05A'
      x.font = '700 34px "Share Tech Mono", monospace'
      x.fillText(`MATCHDAY ${lastMd} · FULL TIME`, W / 2, 130)
      x.fillStyle = '#ffffff'
      x.font = '700 92px "Space Grotesk", sans-serif'
      x.fillText(pool.name, W / 2, 240)
      x.fillStyle = '#555555'
      x.font = '600 30px "Inter", sans-serif'
      x.fillText('intheleague.app', W / 2, 292)

      // Rows
      const top = 380, rowH = 96, pad = 90
      const medal = ['#FFD60A', '#C0C0C0', '#CD7F32']
      scores.slice(0, 8).forEach((s, i) => {
        const y = top + i * rowH
        // Row card
        x.fillStyle = i === 0 ? 'rgba(255,214,10,.07)' : 'rgba(255,255,255,.03)'
        roundRect(x, pad, y, W - pad * 2, rowH - 14, 18); x.fill()
        x.strokeStyle = i === 0 ? 'rgba(255,214,10,.35)' : 'rgba(255,255,255,.07)'
        x.lineWidth = 2; roundRect(x, pad, y, W - pad * 2, rowH - 14, 18); x.stroke()
        // Rank
        x.textAlign = 'left'
        x.fillStyle = i < 3 ? medal[i] : '#555'
        x.font = '700 40px "Space Grotesk", sans-serif'
        x.fillText(String(i + 1), pad + 36, y + 56)
        // Name
        x.fillStyle = '#ffffff'
        x.font = '700 40px "Inter", sans-serif'
        x.fillText(s.name, pad + 110, y + 56)
        // Crown for winner
        if (i === 0 && s.pts > 0) {
          x.fillStyle = '#FFD60A'
          x.font = '600 26px "Inter", sans-serif'
          x.fillText('MATCHDAY WINNER', pad + 110 + x.measureText(s.name).width + 60, y + 54)
        }
        // Wooden spoon for last (if 3+)
        if (i === scores.length - 1 && scores.length >= 3 && i < 8) {
          x.fillStyle = '#884444'
          x.font = '600 26px "Inter", sans-serif'
          x.fillText('WOODEN SPOON', pad + 110 + x.measureText(s.name).width + 60, y + 54)
        }
        // Points — LCD style
        x.textAlign = 'right'
        x.fillStyle = i === 0 ? '#00ff66' : '#ff6600'
        x.shadowColor = i === 0 ? '#00ff6688' : '#ff440066'
        x.shadowBlur = 18
        x.font = '700 52px "Share Tech Mono", monospace'
        x.fillText(String(s.pts), W - pad - 36, y + 60)
        x.shadowBlur = 0
        x.textAlign = 'left'
      })

      // Footer
      x.textAlign = 'center'
      x.fillStyle = '#333333'
      x.font = '600 26px "Share Tech Mono", monospace'
      x.fillText('BEAT YOUR MATES · ALL SEASON LONG', W / 2, H - 70)

      const blob = await new Promise(r => c.toBlob(r, 'image/png'))
      const file = new File([blob], `intheleague-md${lastMd}.png`, { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${pool.name} — Matchday ${lastMd}` })
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = file.name
        a.click()
        URL.revokeObjectURL(a.href)
      }
    } catch (e) { /* user cancelled share */ }
    setBusy(false)
  }

  return (
       <button className="sharecard-btn" onClick={generate} disabled={busy} style={{

      width: '100%', marginBottom: 20, padding: '13px 18px',
      background: 'linear-gradient(180deg,#121a12,#0d0d0d)',
      border: '1px solid #00E05A33', borderRadius: 14,
      color: '#fff', font: 'inherit', fontSize: 13, fontWeight: 700,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 10V2m0 0L5 5m3-3l3 3M3 9v4a1 1 0 001 1h8a1 1 0 001-1V9" stroke="#00E05A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      {busy ? 'Building your card…' : `Share Matchday ${lastMd} results`}
    </button>
  )
}

function roundRect(x, px, py, w, h, r) {
  x.beginPath()
  x.moveTo(px + r, py)
  x.arcTo(px + w, py, px + w, py + h, r)
  x.arcTo(px + w, py + h, px, py + h, r)
  x.arcTo(px, py + h, px, py, r)
  x.arcTo(px, py, px + w, py, r)
  x.closePath()
}
