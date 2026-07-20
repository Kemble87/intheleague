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
// ── TABLE (5500–7500) ──
  if (t >= 5500 && t < 7700 && d.table) {
    const l = t - 5500, out = prog(t, 7500, 7700)
    ctx.globalAlpha = 1 - out
    ctx.textAlign = 'left'
    ctx.fillStyle = '#666'; ctx.font = '600 30px monospace'
    ctx.fillText('AS IT STANDS', 80, 660)
    const cols = [GOLD, '#C0C0C0', '#CD7F32', '#555']
    d.table.slice(0, 4).forEach((r, i) => {
      const rp = easeOut(prog(l, i*140, i*140+450))
      if (rp <= 0) return
      ctx.globalAlpha = (1-out)*rp
      const y = 720 + i*150, dx = (1-rp)*60
      ctx.fillStyle = i === 0 ? '#141003' : '#0d0d0d'
      ctx.strokeStyle = i === 0 ? GOLD : '#1a1a1a'; ctx.lineWidth = 2
      roundRect(ctx, 80+dx, y, W-160, 120, 14); ctx.fill(); ctx.stroke()
      ctx.fillStyle = cols[i]; ctx.font = "700 46px 'Space Grotesk', Inter, sans-serif"
      ctx.fillText(String(i+1), 120+dx, y+78)
      ctx.fillStyle = '#ddd'; ctx.font = "600 46px 'Space Grotesk', Inter, sans-serif"
      ctx.fillText(r.name, 210+dx, y+78)
      if (r.move) {
        ctx.fillStyle = r.move > 0 ? GREEN : RED; ctx.font = '700 32px sans-serif'
        ctx.fillText(`${r.move > 0 ? '▲' : '▼'}${Math.abs(r.move)}`, W-320+dx, y+76)
      }
      ctx.fillStyle = i === 0 ? cols[i] : '#999'; ctx.font = "700 54px 'Space Grotesk', Inter, sans-serif"
      ctx.textAlign = 'right'; ctx.fillText(String(r.pts), W-120, y+80); ctx.textAlign = 'left'
    })
    ctx.globalAlpha = 1
  }

  // ── CHIP (7500–9000) ──
  if (t >= 7500 && t < 9200 && d.chip) {
    const l = t - 7500, inP = easeOut(prog(l, 0, 350)), out = prog(t, 9000, 9200)
    const won = d.chip.pts > 0
    ctx.globalAlpha = (1-out)*inP
    ctx.textAlign = 'left'
    ctx.fillStyle = '#666'; ctx.font = '600 30px monospace'
    ctx.fillText('CHIP WATCH', 80, 820)
    ctx.fillStyle = '#fff'; ctx.font = "800 76px 'Space Grotesk', Inter, sans-serif"
    ctx.fillText(`${d.chip.who} played`, 80, 920)
    ctx.fillStyle = BLUE; ctx.fillText(d.chip.name, 80, 1010)
    ctx.fillStyle = won ? GREEN : RED; ctx.font = "800 64px 'Space Grotesk', Inter, sans-serif"
    ctx.fillText(won ? `+${d.chip.pts} — nailed it.` : 'It backfired.', 80, 1120)
    ctx.globalAlpha = 1
  }

  // ── ENDCARD (9000–10800) ──
  if (t >= 9000) {
    const inP = easeOut(prog(t, 9000, 9500))
    ctx.globalAlpha = inP; ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H)
    ctx.textAlign = 'center'
    ctx.font = "900 72px 'Space Grotesk', Inter, sans-serif"
    ctx.fillStyle = '#fff'; ctx.fillText('In', W/2 - 130, 900)
    ctx.fillStyle = GREEN; ctx.fillText('The', W/2, 900)
    ctx.fillStyle = '#fff'; ctx.fillText('League', W/2 + 150, 900)
    ctx.fillStyle = GREEN; ctx.fillRect(W/2 - 160, 960, 320, 6)
    ctx.fillStyle = '#fff'; ctx.font = "700 52px 'Space Grotesk', Inter, sans-serif"
    ctx.fillText('Beat your mates.', W/2, 1080)
    ctx.fillText('All season long.', W/2, 1150)
    ctx.fillStyle = GREEN
    roundRect(ctx, W/2 - 220, 1230, 440, 90, 45); ctx.fill()
    ctx.fillStyle = '#000'; ctx.font = "800 40px 'Space Grotesk', Inter, sans-serif"
    ctx.fillText('intheleague.app', W/2, 1288)
    ctx.globalAlpha = 1
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r)
  ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath()
}

// Returns { ok, blob, mime, reason }
export async function exportRecap(data, onProgress) {
  const mime = pickMime()
  if (!mime || typeof MediaRecorder === 'undefined') {
    return { ok: false, reason: 'This browser can\'t record video. Try screen-recording the reel instead.' }
  }
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  const stream = canvas.captureStream(FPS)
  const chunks = []
  let recorder
  try {
    recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 })
  } catch (e) {
    return { ok: false, reason: 'Recorder failed to start: ' + e.message }
  }
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data) }

  const done = new Promise(res => { recorder.onstop = res })
  recorder.start()

  const t0 = performance.now()
  await new Promise(resolve => {
    function tick(now) {
      const t = now - t0
      drawFrame(ctx, Math.min(t, DURATION), data)
      onProgress?.(Math.min(1, t / DURATION))
      if (t < DURATION) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })

  recorder.stop()
  await done
  const blob = new Blob(chunks, { type: mime })
  return { ok: true, blob, mime }
}
