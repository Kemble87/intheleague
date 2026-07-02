import { useState, useEffect, useRef } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { rtdb } from '../lib/firebase'
import Fixtures from './Fixtures'
import Chips from './Chips'

export default function PoolView({ user, pool, poolId, onBack }) {
  const [picks, setPicks] = useState({})
  const [allPicks, setAllPicks] = useState({})
  const [results, setResults] = useState({})
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
  const invLink = `${location.href.split('#')[0]}#join-${poolId}`

  return (
    <>
      <button className="back" onClick={onBack}>← All pools</button>

      <div className="share-row">
        <div className="share-row-left">
          Invite code
          <div className="share-row-code">{poolId}</div>
        </div>
        <button className="share-copy" onClick={() => navigator.clipboard?.writeText(invLink)}>Copy link</button>
      </div>

      <Chips poolId={poolId} userId={user.uid} members={members} />

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
