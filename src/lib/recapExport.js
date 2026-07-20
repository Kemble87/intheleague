// ── Recap MP4/WebM export ──
// Draws the reel to a canvas frame-by-frame and records with MediaRecorder.
// iOS-Safari-friendly: canvas-native (no DOM screenshotting), graceful fallbacks.

const GREEN = '#00E05A', GOLD = '#FFD60A', RED = '#FF3B5C', BLUE = '#4499FF'
const W = 1080, H = 1920, FPS = 30, DURATION = 10800 // ms

const prog = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)))
const easeOut = x => 1 - Math.pow(1 - x, 3)
const abbr = n => (n || '?').replace(/^(AFC|FC)\s+/i, '').trim().slice(0, 3).toUpperCase()

function pickMime() {
  const types = [
    'video/mp4;codecs=h264',
    'video/mp4',
    'video/webm;codecs=h264',
    'video/webm;codecs=vp9',
    'video/webm',
  ]
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t
  }
  return ''
}

function drawFrame(ctx, t, d) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H)
  ctx.textBaseline = 'alphabetic'

  // ── FLOODLIGHTS (0–1400) ──
  if (t < 1600) {
    const fade = t > 1400 ? 1 - prog(t, 1400, 1600) : 1
    ctx.globalAlpha = fade
    ctx.strokeStyle = '#111'; ctx.lineWidth = 4
    ctx.beginPath(); ctx.ellipse(W/2, 1300, 640, 420, 0, Math.PI, 2*Math.PI); ctx.stroke()
    const xs = [W*0.14, W*0.38, W*0.62, W*0.86]
    xs.forEach((cx, i) => {
      const lit = prog(t, 200 + i*220, 500 + i*220)
      if (lit > 0) {
        const g = ctx.createLinearGradient(cx, 440, cx, H)
        g.addColorStop(0, `rgba(0,224,90,${0.10*lit})`); g.addColorStop(1, 'rgba(0,224,90,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.moveTo(cx, 460); ctx.lineTo(cx-220, H); ctx.lineTo(cx+220, H); ctx.fill()
      }
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 8
      ctx.beginPath(); ctx.moveTo(cx, 500); ctx.lineTo(cx, 900); ctx.stroke()
      ctx.fillStyle = '#141414'; ctx.fillRect(cx-78, 400, 156, 92)
      for (let c = 0; c < 4; c++) for (let r = 0; r < 2; r++) {
        const v = Math.round(60 + 195*lit)
        ctx.fillStyle = lit > 0 ? `rgb(${v},${v},${Math.round(v*0.92)})` : '#2a2a2a'
        ctx.beginPath(); ctx.arc(cx-52+c*35, 424+r*44, 9, 0, 2*Math.PI); ctx.fill()
      }
    })
    const na = prog(t, 600, 1000) * (1 - prog(t, 1000, 1200))
    if (na > 0) {
      ctx.globalAlpha = fade * na
      ctx.fillStyle = '#666'; ctx.font = `600 34px monospace`; ctx.textAlign = 'center'
      ctx.fillText((d.poolName || 'YOUR LEAGUE').toUpperCase(), W/2, H*0.47)
      ctx.globalAlpha = fade
    }
    const flare = prog(t, 1000, 1300) * (1 - prog(t, 1300, 1500))
    if (flare > 0) { ctx.globalAlpha = flare * 0.9; ctx.fillStyle = '#eafff2'; ctx.fillRect(0,0,W,H) }
    ctx.globalAlpha = 1
  }

  // ── HEADLINE (1400–3500) ──
  if (t >= 1400 && t < 3700) {
    const l = t - 1400
    const out = prog(t, 3500, 3700)
    ctx.globalAlpha = 1 - out
    ctx.textAlign = 'left'
    ctx.fillStyle = '#666'; ctx.font = '600 30px monospace'
    if (prog(l, 100, 400) > 0) ctx.fillText(`MATCHDAY ${d.md ?? 7}`, 80, 620)
    const lines = [(d.winner || 'ROB').toUpperCase(), 'TAKES', 'THE CROWN']
    lines.forEach((w, i) => {
      const wp = easeOut(prog(l, i*130, i*130+380))
      if (wp <= 0) return
      ctx.globalAlpha = (1 - out) * wp
      const crown = i === 2
      ctx.fillStyle = crown ? GOLD : '#fff'
      ctx.font = `800 ${crown ? 92 : 118}px 'Space Grotesk', Inter, sans-serif`
      ctx.fillText(w, 80, 760 + i*140 + (1-wp)*30)
    })
    ctx.globalAlpha = 1 - out
    ctx.fillStyle = GREEN; ctx.fillRect(80, 1200, 240, 8)
    ctx.globalAlpha = 1
  }

  // ── EXACT (3500–5500) ──
  if (t >= 3500 && t < 5700 && d.exact) {
    const l = t - 3500, inP = easeOut(prog(l, 0, 350)), out = prog(t, 5500, 5700)
    const burst = prog(l, 300, 700)
    ctx.globalAlpha = (1 - out) * inP
    ctx.textAlign = 'left'
    ctx.fillStyle = '#666'; ctx.font = '600 30px monospace'
    ctx.fillText('EXACT SCORE · +3', 80, 820)
    ctx.fillStyle = '#050505'; ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3
    roundRect(ctx, 80, 860, 620, 200, 16); ctx.fill(); ctx.stroke()
    ctx.fillStyle = '#777'; ctx.font = '700 38px monospace'
    ctx.fillText(abbr(d.exact.home), 120, 985)
    ctx.fillStyle = GREEN; ctx.font = '700 110px monospace'
    ctx.shadowColor = '#00ff44'; ctx.shadowBlur = 20 + burst*30
    ctx.fillText(`${d.exact.h}:${d.exact.a}`, 300, 995)
    ctx.shadowBlur = 0
    ctx.fillStyle = '#777'; ctx.font = '700 38px monospace'
    ctx.fillText(abbr(d.exact.away), 560, 985)
    if (burst > 0) {
      for (let i = 0; i < 10; i++) {
        const a = i*36, r = 60 + burst*140
        ctx.globalAlpha = (1-out)*inP*(1-burst)
        ctx.fillStyle = i%3 ? GREEN : GOLD
        ctx.beginPath(); ctx.arc(390 + Math.cos(a*Math.PI/180)*r, 960 + Math.sin(a*Math.PI/180)*r, 8, 0, 2*Math.PI); ctx.fill()
      }
    }
    ctx.globalAlpha = (1 - out) * inP
    ctx.fillStyle = '#888'; ctx.font = "400 34px 'Space Grotesk', Inter, sans-serif"
    ctx.fillText(`${d.winner || 'Rob'} called it. Nobody else did.`, 80, 1140)
    ctx.globalAlpha = 1
  }
