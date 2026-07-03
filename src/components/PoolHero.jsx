import { calcPts } from '../lib/helpers'
import { SPORTS } from '../lib/constants'

export default function PoolHero({ pool, fixtures, picks, results, members, userId }) {
  const sport = SPORTS[pool.sport] || SPORTS.PL
  const grad = sport.grad

  // Stats
  const totalPts = (fixtures || []).reduce((s, f) => {
    const p = calcPts(picks[f.id], results[f.id])
    return p != null ? s + p : s
  }, 0)
  const exactPts = (fixtures || []).filter(f => calcPts(picks[f.id], results[f.id]) === 3).length
  const picksMade = (fixtures || []).filter(f => picks[f.id]?.h != null).length

  // Rank — calculate board position
  const board = members.map(([uid, m]) => {
    const mp = uid === userId ? picks : {}
    let p = 0
    ;(fixtures || []).forEach(f => {
      const s = calcPts(mp[f.id], results[f.id])
      if (s != null) p += s
    })
    return { uid, pts: p }
  }).sort((a, b) => b.pts - a.pts)
  const rankIdx = board.findIndex(r => r.uid === userId)
  const rank = rankIdx + 1

  function ordinal(n) {
    const s = ['th','st','nd','rd'], v = n % 100
    return n + (s[(v-20)%10] || s[v] || s[0])
  }

  // Matchday progress
  const matchdays = [...new Set((fixtures || []).map(f => f.matchday).filter(Boolean))].sort((a,b)=>a-b)
  const totalMD = matchdays.length || 38
  // Current matchday = last one with a result
  const playedFixtures = (fixtures || []).filter(f => results[f.id]?.h != null)
  const currentMD = playedFixtures.length > 0
    ? Math.max(...playedFixtures.map(f => f.matchday || 1))
    : 1
  const progress = Math.round((currentMD / totalMD) * 100)

  const playerList = members.slice(0, 3)
  const me = pool.members?.[userId]

  return (
    <div style={{
      background: grad,
      borderRadius: 12,
      padding: '28px 22px 22px',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      {/* dark fade at bottom */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'50%', background:'linear-gradient(to top,rgba(0,0,0,.35),transparent)', pointerEvents:'none' }}/>

      {/* Players pill top right */}
      <div style={{ position:'absolute', top:22, right:20, display:'flex', alignItems:'center', gap:6, background:'rgba(0,0,0,.25)', borderRadius:500, padding:'5px 12px 5px 8px', zIndex:1 }}>
        <div style={{ display:'flex' }}>
          {playerList.map(([uid, m], i) => (
            <div key={uid} style={{ width:20, height:20, borderRadius:'50%', background: uid===userId ? '#00E05A' : 'rgba(255,255,255,.25)', border:'1.5px solid rgba(0,0,0,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:800, color: uid===userId?'#000':'#fff', marginLeft: i>0?-5:0 }}>
              {(m.name||'?').slice(0,2).toUpperCase()}
            </div>
          ))}
        </div>
        <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,.7)' }}>{members.length} player{members.length!==1?'s':''}</span>
      </div>

      {/* Eyebrow */}
      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.55)', marginBottom:10 }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:'#00E05A', display:'inline-block' }}/>
        {sport.name}
      </div>

      {/* Pool name */}
      <div style={{ fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:'clamp(32px,7vw,46px)', fontWeight:700, color:'#fff', letterSpacing:'-.03em', lineHeight:1, marginBottom:14, position:'relative', zIndex:1 }}>
        {pool.name}
      </div>

      {/* Meta line */}
      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'rgba(255,255,255,.6)', fontWeight:500, marginBottom:22, position:'relative', zIndex:1, flexWrap:'wrap' }}>
        <strong style={{ color:'#fff', fontWeight:700 }}>{me?.name?.split(' ')[0] || 'You'}</strong>
        <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(255,255,255,.4)', display:'inline-block' }}/>
        <span>Season 2025/26</span>
        <span style={{ width:3, height:3, borderRadius:'50%', background:'rgba(255,255,255,.4)', display:'inline-block' }}/>
        <span>{fixtures.length} fixtures</span>
      </div>

      {/* Stats */}
      <div style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(255,255,255,.12)', paddingTop:20 }}>
        <div style={{ display:'flex', alignItems:'flex-end', gap:0, marginBottom:20 }}>
          {/* Points — dominant */}
          <div style={{ flexShrink:0, marginRight:24 }}>
            <div style={{ fontSize:72, fontWeight:900, color:'#00E05A', letterSpacing:'-.05em', lineHeight:1 }}>{totalPts}</div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.35)', marginTop:2 }}>Points</div>
          </div>

          <div style={{ width:1, background:'rgba(255,255,255,.12)', height:56, marginRight:24, flexShrink:0 }}/>

          {/* Supporting stats */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, justifyContent:'flex-end', paddingBottom:2 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-.03em', lineHeight:1, minWidth:32 }}>{exactPts}</div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.35)' }}>Exact scores</div>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-.03em', lineHeight:1, minWidth:32 }}>{picksMade}</div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.35)' }}>Picks made</div>
            </div>
          </div>

          {/* Rank */}
          {members.length > 1 && (
            <>
              <div style={{ width:1, background:'rgba(255,255,255,.12)', height:56, margin:'0 24px', flexShrink:0 }}/>
              <div style={{ textAlign:'center', paddingBottom:2 }}>
                <div style={{ fontSize:40, fontWeight:900, color:'#FFD60A', letterSpacing:'-.04em', lineHeight:1 }}>
                  {rank}<span style={{ fontSize:18, fontWeight:700, color:'rgba(255,212,10,.6)', verticalAlign:'super', marginLeft:1 }}>{ordinal(rank).replace(String(rank),'')}</span>
                </div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.35)', marginTop:2 }}>Your rank</div>
              </div>
            </>
          )}
        </div>

        {/* Matchday progress */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,.4)' }}>Season progress</span>
            <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.6)', letterSpacing:'.04em' }}>Matchday {currentMD} of {totalMD}</span>
          </div>
          <div style={{ height:4, background:'rgba(255,255,255,.12)', borderRadius:999, overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:999, background:'linear-gradient(to right,#00E05A,#00b348)', width: progress+'%', transition:'width .6s ease' }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
            {['MD1','MD10','MD19','MD29','MD38'].map(md => (
              <span key={md} style={{ fontSize:9, color:'rgba(255,255,255,.2)', fontWeight:600, letterSpacing:'.04em' }}>{md}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
