import { useMemo } from 'react'
import { calcPts, matchdayScores, runInStart } from '../lib/helpers'

const MONO = "'Share Tech Mono',ui-monospace,monospace"
const CHIP_NAMES = { '2x': '2× MULTIPLIER', banker: 'THE BANKER', hth: 'HALF TIME HERO', copycat: 'COPYCAT', coupon: 'COUPON BUSTER' }

export default function Ticker({ pool, members, allChips, fixtures, allPicks, results }) {
  const items = useMemo(() => {
    const out = []
    const now = Date.now()
    const riStart = runInStart(fixtures)
    const nameOf = uid => (pool.members?.[uid]?.name || '?').split(' ')[0].toUpperCase()
    const upcoming = (fixtures || []).filter(f => new Date(f.kickoff) > now)

    if (upcoming.length && upcoming.some(f => Number(f.matchday) >= riStart) && upcoming.every(f => Number(f.matchday) >= riStart - 2)) {
      const maxMd = Math.max(...(fixtures || []).map(f => Number(f.matchday) || 0))
      out.push({ text: `THE RUN-IN · DOUBLE POINTS MD${riStart}–MD${maxMd}`, color: '#FF3B5C' })
    }
    if (upcoming.length) {
      const next = upcoming.reduce((m, f) => new Date(f.kickoff) < new Date(m.kickoff) ? f : m, upcoming[0])
      const t = new Date(next.kickoff) - now
      const d = Math.floor(t / 864e5), h = Math.floor((t % 864e5) / 36e5), m = Math.floor((t % 36e5) / 6e4)
      const cd = d > 0 ? `${d}D ${h}H` : h > 0 ? `${h}H ${m}M` : `${m}M`
      out.push({ text: `MATCHDAY ${next.matchday} LOCKS IN ${cd}`, color: '#ff6600' })
    }
    Object.entries(allChips || {}).forEach(([uid, chips]) => {
      Object.entries(chips || {}).forEach(([chipId, data]) => {
        const cn = CHIP_NAMES[chipId]
        if (!cn) return
        const md = data?.matchday && data.matchday !== 'ALL' ? ` ON MD${data.matchday}` : ''
        out.push({ text: `${nameOf(uid)} PLAYED ${cn}${md}`, color: '#00E05A' })
      })
    })
    if ((members || []).length > 1) {
      const mds = matchdayScores(fixtures, results, members.map(([uid]) => uid), allPicks, allChips)
      const done = Object.entries(mds).filter(([, v]) => v.complete).map(([md, v]) => [Number(md), v]).sort((a, b) => b[0] - a[0])
      if (done.length) {
        const [md, { scores }] = done[0]
        const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
        if (ranked[0] && ranked[0][1] > 0) {
          out.push({ text: `${nameOf(ranked[0][0])} TAKES MATCHDAY ${md} · ${ranked[0][1]} PTS`, color: '#FFD60A' })
          const last = ranked[ranked.length - 1]
          if (last && last[0] !== ranked[0][0]) out.push({ text: `WOODEN SPOON MD${md}: ${nameOf(last[0])} · ${last[1]} PTS`, color: '#8a4a4a' })
        }
      }
      const totals = members.map(([uid, m]) => {
        let p = 0
        ;(fixtures || []).forEach(f => {
          let s = calcPts((allPicks[uid] || {})[f.id], results[f.id])
          if (s != null) { if (Number(f.matchday) >= riStart) s *= 2; p += s }
        })
        return { name: (m.name || '?').split(' ')[0].toUpperCase(), pts: p }
      }).sort((a, b) => b.pts - a.pts)
      if (totals[0]?.pts > 0) {
        const gap = totals[0].pts - (totals[1]?.pts ?? 0)
        out.push({ text: `${totals[0].name} LEADS ON ${totals[0].pts} PTS${gap > 0 ? ` · ${gap} CLEAR` : ''}`, color: '#FFD60A' })
      }
    }
    out.push({ text: `${(fixtures || []).length || 380} FIXTURES SYNCED LIVE`, color: '#555' })
    if (!out.some(i => i.color === '#00E05A')) out.push({ text: 'FIVE CHIPS · ONE SHOT AT GLORY', color: '#555' })
    return out
  }, [pool, members, allChips, fixtures, allPicks, results])

  if (!items.length) return null
  const dur = Math.max(18, items.length * 7)

  return (
    <div style={{ background: '#050505', border: '1px solid #161616', borderRadius: 10, overflow: 'hidden', marginBottom: 20, position: 'relative', height: 34, display: 'flex', alignItems: 'center' }}>
      <style>{`@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,rgba(0,0,0,.35) 0px,rgba(0,0,0,.35) 1px,transparent 1px,transparent 3px)', zIndex: 2, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(to right,#050505,transparent)', zIndex: 3, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(to left,#050505,transparent)', zIndex: 3, pointerEvents: 'none' }}/>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: `tickerScroll ${dur}s linear infinite`, willChange: 'transform' }}>
        {[0, 1].map(rep => (
          <div key={rep} style={{ display: 'flex' }}>
            {items.map((item, i) => (
              <span key={rep + '-' + i} style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.1em', color: item.color, textShadow: `0 0 8px ${item.color}55`, padding: '0 14px', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
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
