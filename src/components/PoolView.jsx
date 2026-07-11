import { useState, useEffect, useRef } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { rtdb } from '../lib/firebase'
import { fetchAndStoreFixtures } from '../lib/helpers'
import Fixtures from './Fixtures'
import Chips from './Chips'
import Members from './Members'
import PoolHero from './PoolHero'
import OrgNudge from './OrgNudge'
import Ticker from './Ticker'
import ShareCard from './ShareCard'
import PoolIntro from './PoolIntro'
import DivisionTable from './DivisionTable'
import Bulletin from './Bulletin'


export default function PoolView({ user, pool, poolId, onBack }) {
  const [picks, setPicks] = useState({})
  const [allPicks, setAllPicks] = useState({})
  const [results, setResults] = useState({})
  const [fixtures, setFixtures] = useState([])
  const [showPlayers, setShowPlayers] = useState(false)
  const [allChips, setAllChips] = useState({})
  const timers = useRef({})

  useEffect(() => {
    const r = ref(rtdb, `pools/${poolId}/picks/${user.uid}`)
    const u = onValue(r, s => setPicks(s.val() || {}))
    return () => u()
  }, [poolId, user.uid])

  useEffect(() => {
    const r = ref(rtdb, `pools/${poolId}/picks`)
    const u = onValue(r, s => setAllPicks(s.val() || {}))
    return () => u()
  }, [poolId])

  useEffect(() => {
    const r = ref(rtdb, `pools/${poolId}/results`)
    const u = onValue(r, s => setResults(s.val() || {}))
    return () => u()
  }, [poolId])

  // Load fixtures so Chips step pickers can use them
  useEffect(() => {
    const r = ref(rtdb, `pools/${poolId}/fixtures`)
    const u = onValue(r, s => {
      if (s.exists()) {
        setFixtures(Object.values(s.val()).sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff)))
      }
    })
    return () => u()
  }, [poolId])

  useEffect(() => {
    const r = ref(rtdb, `pools/${poolId}/chips`)
    const u = onValue(r, s => setAllChips(s.val() || {}))
    return () => u()
  }, [poolId])

  // Auto-sync results: if a match finished 2h+ ago with no result, quietly
  // pull fresh scores from the API (throttled to once per 45 min per pool)
  useEffect(() => {
    if (!fixtures.length || !pool?.sport) return
    const now = Date.now()
    const stale = fixtures.some(f => now - new Date(f.kickoff).getTime() > 2 * 3600e3 && results[f.id]?.h == null)
    if (!stale) return
    ;(async () => {
      try {
        const { get } = await import('firebase/database')
        const syncRef = ref(rtdb, `pools/${poolId}/lastAutoSync`)
        const snap = await get(syncRef)
        const last = snap.exists() ? snap.val() : 0
        if (now - last < 45 * 60e3) return
        await set(syncRef, now)
        await fetchAndStoreFixtures(pool.sport, poolId, rtdb)
      } catch (e) { /* silent — manual sync still available */ }
    })()
  }, [fixtures, results, poolId, pool?.sport])

  function savePick(fid, side, val) {
    const upd = { ...(picks[fid] || {}), [side]: val }
    setPicks(p => ({ ...p, [fid]: upd }))
    clearTimeout(timers.current[fid])
    timers.current[fid] = setTimeout(() => set(ref(rtdb, `pools/${poolId}/picks/${user.uid}/${fid}`), upd), 400)
  }

  function saveResult(fid, side, val) {
    const upd = { ...(results[fid] || {}), [side]: val }
    setResults(r => ({ ...r, [fid]: upd }))
    clearTimeout(timers.current['r' + fid])
    timers.current['r' + fid] = setTimeout(() => set(ref(rtdb, `pools/${poolId}/results/${fid}`), upd), 400)
  }

  const members = Object.entries(pool.members || {})

  const isOrg = pool.createdBy === user.uid || pool.members?.[user.uid]?.isOrganiser

  return (
    <>
      <PoolIntro pool={pool} poolId={poolId} />
      <button className="back" onClick={onBack}>← All pools</button>
      <PoolHero pool={pool} fixtures={fixtures} picks={picks} results={results} members={members} userId={user.uid} onOpenPlayers={() => setShowPlayers(s => !s)} />
      {showPlayers && <Members poolId={poolId} pool={pool} userId={user.uid} />}
      <Ticker pool={pool} members={members} allChips={allChips} fixtures={fixtures} allPicks={allPicks} results={results} userId={user.uid} />
      <ShareCard pool={pool} members={members} fixtures={fixtures} results={results} allPicks={allPicks} allChips={allChips} userPicks={picks} userId={user.uid} />
          <Bulletin pool={pool} poolId={poolId} members={members} fixtures={fixtures} results={results} allPicks={allPicks} allChips={allChips} userId={user.uid} userPicks={picks} />

       {isOrg && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <a href={`https://wa.me/?text=${encodeURIComponent(`Join our ${pool.name} prediction league on InTheLeague — free all season: https://intheleague.app#join-${poolId}`)}`}
            target="_blank" rel="noreferrer"
            style={{ padding: '12px 10px', background: '#0d1a10', border: '1px solid #25D36644', borderRadius: 14, color: '#25D366', fontSize: 12.5, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.4 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3a3 3 0 00-1 2.2 5.2 5.2 0 001.1 2.8 11.9 11.9 0 004.6 4 15 15 0 001.5.6 3.7 3.7 0 001.7.1 2.8 2.8 0 001.9-1.3 2.3 2.3 0 00.2-1.3c-.1-.2-.3-.2-.5-.4z"/></svg>
            Invite on WhatsApp
          </a>
          <button onClick={async () => {
            const link = `https://intheleague.app#watch-${poolId}`
            try { await navigator.clipboard.writeText(link); alert('Spectator link copied — anyone can watch, no login needed.') }
            catch (e) { window.prompt('Copy this link:', link) }
          }} style={{ padding: '12px 10px', background: 'none', border: '1px solid #1e1e1e', borderRadius: 14, color: '#888', font: 'inherit', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8s-2.4 4.5-6.5 4.5S1.5 8 1.5 8z" stroke="#00E05A" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="#00E05A" strokeWidth="1.2"/></svg>
            Spectator link
          </button>
        </div>
      )}
      <DivisionTable sport={pool.sport} leagueName={(pool.sport === 'CHAMP' ? 'Championship' : pool.sport === 'L1' ? 'League One' : 'Premier League')} />
      {isOrg && (
        <OrgNudge pool={pool} poolId={poolId} members={members} allPicks={allPicks} fixtures={fixtures} results={results} />
      )}
      <Chips
        poolId={poolId}
        userId={user.uid}
        members={members}
        fixtures={fixtures}
      />
      <Fixtures
        poolId={poolId}
        pool={pool}
        user={user}
        picks={picks}
        allPicks={allPicks}
        results={results}
        onSavePick={savePick}
        onSaveResult={saveResult}
      />
    </>
  )
}
