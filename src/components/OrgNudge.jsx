import { useMemo } from 'react'
import { initials } from '../lib/helpers'

function timeUntil(iso) {
  const t = new Date(iso) - Date.now()
  if (t <= 0) return null
  const h = Math.floor(t / 3.6e6)
  const m = Math.floor((t % 3.6e6) / 6e4)
  const d = Math.floor(h / 24)
  if (d > 1) return `${d} days`
  if (h >= 1) return `${h}h ${m}m`
  return `${m}m`
}

export default function OrgNudge({ pool, poolId, members, allPicks, fixtures, results }) {
  const isOrg = pool.createdBy === members.find(([,m]) => m.isOrganiser)?.[0] ||
    members.some(([uid, m]) => m.isOrganiser)

  // Find current/next matchday
  const now = Date.now()
  const currentMD = useMemo(() => {
    const upcoming = (fixtures || []).filter(f => new Date(f.kickoff) > now)
    if (!upcoming.length) return null
    return upcoming.reduce((min, f) => f.matchday < min ? f.matchday : min, upcoming[0].matchday)
  }, [fixtures, now])

  // Fixtures in current matchday
  const mdFixtures = useMemo(() =>
    (fixtures || []).filter(f => String(f.matchday) === String(currentMD)),
    [fixtures, currentMD]
  )

  // First kickoff of the matchday
  const firstKickoff = useMemo(() => {
    if (!mdFixtures.length) return null
    return mdFixtures.reduce((min, f) =>
      new Date(f.kickoff) < new Date(min) ? f.kickoff : min, mdFixtures[0].kickoff
    )
  }, [mdFixtures])

  const lockCountdown = firstKickoff ? timeUntil(firstKickoff) : null

  // Who hasn't picked for this matchday
  const missing = useMemo(() => {
    if (!mdFixtures.length) return []
    return members.filter(([uid, m]) => {
      const userPicks = allPicks[uid] || {}
      const picked = mdFixtures.filter(f => userPicks[f.id]?.h != null).length
      return picked === 0
    })
  }, [members, allPicks, mdFixtures])

  const partial = useMemo(() => {
    if (!mdFixtures.length) return []
    return members.filter(([uid, m]) => {
      const userPicks = allPicks[uid] || {}
      const picked = mdFixtures.filter(f => userPicks[f.id]?.h != null).length
      return picked > 0 && picked < mdFixtures.length
    })
  }, [members, allPicks, mdFixtures])

  function nudgeMsg(name) {
    const lock = lockCountdown ? ` — locks in ${lockCountdown}` : ''
    return `Hey ${name}! Don't forget to get your picks in for Matchday ${currentMD}${lock} ⚽ Get on it: intheleague.app`
  }

  function nudgeAll() {
    const names = missing.map(([, m]) => m.name?.split(' ')[0]).join(', ')
    const lock = lockCountdown ? ` — locks in ${lockCountdown}` : ''
    const msg = `${names} — get your Matchday ${currentMD} picks in${lock} ⚽ intheleague.app`
        navigator.clipboard?.writeText(msg)
    alert('Nudge copied — paste it in the group chat.')
  }

  }

  if (!currentMD || missing.length === 0) return null

  return (
    <div style={{
      background: '#111',
      border: '1px solid #1a1a1a',
      borderRadius: 14,
      padding: '16px',
      marginBottom: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚡</span>
            <span>Matchday {currentMD} · {missing.length} yet to pick</span>
          </div>
          {lockCountdown && (
            <div style={{ fontSize: 11, color: '#FF3B5C', marginTop: 3, fontWeight: 600 }}>
              Locks in {lockCountdown}
            </div>
          )}
        </div>
        {missing.length > 1 && (
          <button
            onClick={nudgeAll}
            style={{
              padding: '7px 14px',
              background: 'none',
              border: '1px solid #333',
              borderRadius: 500,
              color: '#aaa',
              font: 'inherit',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Nudge all 👋
          </button>
        )}
      </div>

      {/* Missing players */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {missing.map(([uid, m]) => (
          <div key={uid} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#1a1a1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#555', flexShrink: 0,
            }}>
              {initials(m.name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 1 }}>No picks yet</div>
            </div>
                          onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(nudgeMsg(m.name?.split(' ')[0] || m.name)), '_blank')}

              style={{
                padding: '6px 14px',
                background: 'none',
                border: '1px solid #222',
                borderRadius: 500,
                color: '#aaa',
                font: 'inherit',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Nudge 👋
            </button>
          </div>
        ))}

        {/* Partial pickers */}
        {partial.map(([uid, m]) => {
          const userPicks = allPicks[uid] || {}
          const picked = mdFixtures.filter(f => userPicks[f.id]?.h != null).length
          return (
            <div key={uid} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: '#001a0d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, color: 'var(--green)', flexShrink: 0,
              }}>
                {initials(m.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>{picked} of {mdFixtures.length} picked</div>
              </div>
              <button
                             onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(nudgeMsg(m.name?.split(' ')[0] || m.name)), '_blank')}

                  padding: '6px 14px',
                  background: 'none',
                  border: '1px solid #222',
                  borderRadius: 500,
                  color: '#aaa',
                  font: 'inherit',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Nudge 👋
              </button>
            </div>
          )
        })}
      </div>

      {/* Tip */}
      <div style={{ fontSize: 11, color: '#333', marginTop: 14, borderTop: '1px solid #111', paddingTop: 12 }}>
        Nudge copies a message to your clipboard — paste into WhatsApp, iMessage, whatever works.
      </div>
    </div>
  )
}
