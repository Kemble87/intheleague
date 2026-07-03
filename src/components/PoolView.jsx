import { useState, useEffect, useRef } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { rtdb } from '../lib/firebase'
import Fixtures from './Fixtures'
import Chips from './Chips'
import Members from './Members'
import PoolHero from './PoolHero'
import OrgNudge from './OrgNudge'

export default function PoolView({ user, pool, poolId, onBack }) {
  const [picks, setPicks] = useState({})
  const [allPicks, setAllPicks] = useState({})
  const [results, setResults] = useState({})
  const [fixtures, setFixtures] = useState([])
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
      <button className="back" onClick={onBack}>← All pools</button>
      <PoolHero pool={pool} fixtures={fixtures} picks={picks} results={results} members={members} userId={user.uid} />
      {isOrg && (
        <OrgNudge pool={pool} poolId={poolId} members={members} allPicks={allPicks} fixtures={fixtures} results={results} />
      )}
      <Chips
        poolId={poolId}
        userId={user.uid}
        members={members}
        fixtures={fixtures}
      />
      <Members poolId={poolId} pool={pool} userId={user.uid} />
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
