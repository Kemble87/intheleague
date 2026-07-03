import { useMemo } from 'react'
import { calcPts, matchdayScores } from '../lib/helpers'

export default function Ticker({ pool, members, allChips, fixtures, allPicks, results, userId }) {
  const items = useMemo(() => {
    const out = []
    const now = Date.now()

    // Next lock countdown
    const upcoming = (fixtures || []).filter(f => new Date(f.kickoff) > now)
    if (upcoming.length) {
      const next = upcoming.reduce((m, f) => new Date(f.kickoff) < new Date(m.kickoff) ? f : m, upcoming[0])
      const t = new Date(next.kickoff) - now
      const d = Math.floor(t / 864e5)
      const h = Math.floor((t % 864e5) / 36e5)
      const m = Math.floor((t % 36e5) / 6e4)
      const cd = d > 0 ? `${d}D ${h}H` : h > 0 ? `${h}H ${m}M` : `${m}M`
      out.push({ text: `MATCHDAY ${next.matchday} LOCKS IN ${cd}`, color: '#ff6600' })
    }

    // Chips played
    const CHIP_NAMES = { '2x': '2× MULTIPLIER', banker: 'THE BANKER', hth: 'HALF TIME HERO', copycat: 'COPYCAT', coupon: 'COUPON BUSTER' }
    Object.entries(allChips || {}).forEach(([uid, chips]) => {
      const name = (pool.members?.[uid]?.name || 'SOMEONE').split(' ')[0].toUpperCase()
      Object.entries(chips || {}).forEach(([chipId, data]) => {
        const cn = CHIP_NAMES[chipId]
        if (!cn) return
        const md = data?.matchday && data.matchday !== 'ALL' ? ` ON MD${data.matchday}` : ''
        out.push({ text: `${name} PLAYED ${cn}${md}`, color: '#00E05A' })
      })
    })

    // Last completed matchday — winner and wooden spoon
    if ((members || []).length > 1) {
      const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), allPicks, allChips)
      const completed = Object.entries(mds).filter(([, v]) => v.complete).map(([md, v]) => [Number(md), v]).sort((a, b) => b[0] - a[0])
      if (completed.length) {
        const [md, { scores }] = completed[0]
        const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
        const nameOf = uid => (pool.members?.[uid]?.name || '?').split(' ')[0].toUpperCase()
        if (ranked[0] && ranked[0][1] > 0) {
          out.push({ text: `${nameOf(ranked[0][0])} TAKES MATCHDAY ${md} · ${ranked[0][1]} PTS`, color: '#FFD60A' })
          const last = ranked[ranked.length - 1]
          if (last && last[0] !== ranked[0][0]) {
            out.push({ text: `WOODEN SPOON MD${md}: ${nameOf(last[0])} · ${last[1]} PTS`, color: '#8a4a4a' })
          }
        }
      }
    }

    // Leader
    if ((members || []).length > 1) {
      const scores = members.map(([uid, m]) => {
        let p = 0
        ;(fixtures || []).forEach(f => {
          const s = calcPts((allPicks[uid] || {})[f.id], results[f.id])
          if (s != null) p += s
        })
        return { name: (m.name || '?').split(' ')[0].toUpperCase(), pts: p }
      }).sort((a, b) => b.pts - a.pts)
      if (scores[0]?.pts > 0) {
        const gap = scores[0].pts - (scores[1]?.pts ?? 0)
        out.push({ text: `${scores[0].name} LEADS ON ${scores[0].pts} PTS${gap > 0 ? ` · ${gap} CLEAR` : ''}`, color: '#FFD60A' })
      }
    }

    // Last completed matchday — MVP and wooden spoon
    {
      const byMd = {}
      ;(fixtures || []).forEach(f => { (byMd[f.matchday] = byMd[f.matchday] || []).push(f) })
      const completed = Object.entries(byMd)
        .filter(([, fxs]) => fxs.every(f => results[f.id]?.h != null))
        .map(([md]) => Number(md)).sort((a, b) => b - a)
      const lastMd = completed[0]
      if (lastMd != null && (members || []).length > 1) {
        const scores = members.map(([uid, m]) => {
          const pts = byMd[lastMd].reduce((s, f) => {
            const p = calcPts((allPicks[uid] || {})[f.id], results[f.id])
            return p != null ? s + p : s
          }, 0)
          return { name: (m.name || '?').split(' ')[0].toUpperCase(), pts }
        }).sort((a, b) => b.pts - a.pts)
        if (scores[0].pts > 0) {
          out.push({ text: `${scores[0].name} TAKES MATCHDAY ${lastMd} · ${scores[0].pts} PTS`, color: '#FFD60A' })
          const last = scores[scores.length - 1]
          if (last.pts < scores[0].pts) {
            out.push({ text: `WOODEN SPOON MD${lastMd} · ${last.name} · ${last.pts} PTS`, color: '#884444' })
          }
        }
      }
    }

    // Fillers
    out.push({ text: `${(fixtures || []).length || 380} FIXTURES SYNCED LIVE`, color: '#555' })
    if (!out.some(i => i.color === '#00E05A')) {
      out.push({ text: 'FIVE CHIPS · ONE SHOT AT GLORY', color: '#555' })
    }
    return out
  }, [pool, members, allChips, fixtures, allPicks, results])

  if (!items.length) return null

  const strip = items.map(i => i)
  const dur = Math.max(18, items.length * 7)

  return (
    <div style={{
      background: '#050505',
      border: '1px solid #161616',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 20,
      position: 'relative',
      height: 34,
      display: 'flex',
      alignItems: 'center',
    }}>
      <style>{`
        @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
      {/* scanlines */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(0,0,0,.35) 0px,rgba(0,0,0,.35) 1px,transparent 1px,transparent 3px)', zIndex: 2, pointerEvents: 'none' }}/>
      {/* fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(to right,#050505,transparent)', zIndex: 3, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(to left,#050505,transparent)', zIndex: 3, pointerEvents: 'none' }}/>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: `tickerScroll ${dur}s linear infinite`, willChange: 'transform' }}>
        {[0, 1].map(rep => (
          <div key={rep} style={{ display: 'flex' }}>
            {strip.map((item, i) => (
              <span key={`${rep}-${i}`} style={{
                fontFamily: "'Share Tech Mono',ui-monospace,monospace",
                fontSize: 12,
                letterSpacing: '.1em',
                color: item.color,
                textShadow: `0 0 8px ${item.color}55`,
                padding: '0 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
              }}>
                {item.text}
                <span style={{ color: '#222', textShadow: 'none' }}>···</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
