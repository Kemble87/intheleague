const koFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short', day: '2-digit', month: 'short',
  hour: '2-digit', minute: '2-digit', hour12: false,
})
const dayFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long',
})
const dateFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
})

export function fmtKO(iso) {
  if (!iso) return ''
  const p = koFmt.formatToParts(new Date(iso)).reduce((a, b) => (a[b.type] = b.value, a), {})
  return `${p.weekday} ${p.day} ${p.month} · ${p.hour}:${p.minute}`
}

export function fmtDay(iso) {
  return dayFmt.format(new Date(iso))
}

export function groupDays(arr) {
  const m = {}, o = []
  ;(arr || []).forEach(f => {
    const d = dateFmt.format(new Date(f.kickoff))
    if (!m[d]) { m[d] = []; o.push(d) }
    m[d].push(f)
  })
  return o.map(d => ({ d, label: fmtDay(new Date(d + 'T12:00:00Z')), items: m[d] }))
}

export function countdown(iso, now) {
  const t = new Date(iso) - now
  if (t <= 0 || t > 172800000) return null
  const h = Math.floor(t / 3.6e6)
  const m = Math.floor((t % 3.6e6) / 6e4)
  return h >= 1 ? `${h}h ${m}m` : `${m}m`
}

export function pts(pick, result) {
  if (!pick || !result || pick.h == null || pick.a == null || result.h == null || result.a == null) return null
  if (pick.h === result.h && pick.a === result.a) return 3
  if (Math.sign(pick.h - pick.a) === Math.sign(result.h - result.a)) return 1
  return 0
}

export function initials(s) {
  return (s || '?').split(/[\s@]/)[0].slice(0, 2).toUpperCase()
}

export function slugify(s) {
  return (s || 'pool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 18) +
    '-' + Math.random().toString(36).slice(2, 5)
}

export function abbr(n) {
  const w = n.split(' ')
  return w.length > 1 ? w.map(x => x[0]).join('').slice(0, 3).toUpperCase() : n.slice(0, 3).toUpperCase()
}
