import { useState, useEffect } from 'react'

const COMP_IDS = { PL: 'PL', CHAMP: 'ELC', L1: 'EL1', WC: 'WC' }
const DISP = "'Space Grotesk','Inter',sans-serif"
const MONO = "'Share Tech Mono',ui-monospace,monospace"

export default function DivisionTable({ sport, leagueName }) {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState(null)
  const [failed, setFailed] = useState(false)
  const comp = COMP_IDS[sport]

  useEffect(() => {
    if (!open || rows || failed || !comp) return
    ;(async () => {
      try {
        const res = await fetch(`/.netlify/functions/fixtures?comp=${comp}&season=2026&type=standings`)
        const data = await res.json()
        const table = (data.standings || []).find(s => s.type === 'TOTAL')?.table || []
        if (!table.length) { setFailed(true); return }
        setRows(table.map(t => ({
          pos: t.position,
          name: t.team?.shortName || t.team?.name || '?',
          p: t.playedGames, gd: t.goalDifference, pts: t.points,
        })))
      } catch (e) { setFailed(true) }
    })()
  }, [open, rows, failed, comp])

  if (!comp || sport === 'WC') return null

  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '12px 18px', background: 'none',
        border: '1px solid #1e1e1e', borderRadius: open ? '14px 14px 0 0' : 14,
        color: '#888', font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 3h4v10H2zM6 6h4v7H6zM10 9h4v4h-4z" stroke="#00E05A" strokeWidth="1.2" strokeLinejoin="round"/></svg>
        {open ? 'Hide' : 'View'} the real {leagueName} table
        <span style={{ color: '#444', fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ border: '1px solid #1e1e1e', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: '14px 14px 10px', background: '#0a0a0a' }}>
          {failed && <div style={{ textAlign: 'center', color: '#444', fontSize: 12, padding: '14px 0' }}>Table not available yet — check back once the season starts.</div>}
          {!rows && !failed && <div style={{ textAlign: 'center', color: '#333', fontFamily: MONO, fontSize: 11, letterSpacing: '.2em', padding: '14px 0' }}>LOADING…</div>}
          {rows && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 34px 40px 40px', gap: 4, padding: '0 6px 8px', fontSize: 9, fontWeight: 700, letterSpacing: '.12em', color: '#444', textTransform: 'uppercase' }}>
                <span>#</span><span>Team</span><span style={{ textAlign: 'right' }}>P</span><span style={{ textAlign: 'right' }}>GD</span><span style={{ textAlign: 'right' }}>Pts</span>
              </div>
              {rows.map(r => {
                const zone = r.pos <= 4 ? '#00E05A' : r.pos >= rows.length - 2 ? '#FF3B5C' : null
                return (
                  <div key={r.pos} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 34px 40px 40px', gap: 4, alignItems: 'center', padding: '7px 6px', borderTop: '1px solid #131313', fontSize: 13 }}>
                    <span style={{ fontFamily: DISP, fontWeight: 700, color: zone || '#555', fontSize: 12, borderLeft: zone ? `2px solid ${zone}` : '2px solid transparent', paddingLeft: 6, marginLeft: -6 }}>{r.pos}</span>
                    <span style={{ color: '#ddd', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                    <span style={{ textAlign: 'right', color: '#555', fontSize: 12 }}>{r.p}</span>
                    <span style={{ textAlign: 'right', color: r.gd > 0 ? '#00E05A' : r.gd < 0 ? '#FF3B5C' : '#555', fontSize: 12 }}>{r.gd > 0 ? '+' : ''}{r.gd}</span>
                    <span style={{ textAlign: 'right', fontFamily: DISP, fontWeight: 700, color: '#fff' }}>{r.pts}</span>
                  </div>
                )
              })}
              <div style={{ display: 'flex', gap: 14, padding: '10px 6px 4px', fontSize: 9, color: '#444', letterSpacing: '.06em' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 2, background: '#00E05A', display: 'inline-block' }}/>TOP</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 2, background: '#FF3B5C', display: 'inline-block' }}/>RELEGATION</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
