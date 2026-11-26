export const SPORTS = {
  PL:   { name: 'Premier League',  short: 'PL',  emoji: '⚽', grad: 'linear-gradient(135deg,#3d0066,#6600aa)' },
  CHAMP:{ name: 'Championship',    short: 'CH',  emoji: '⚽', grad: 'linear-gradient(135deg,#003366,#0055aa)' },
    L1:   { name: 'League One',      short: 'L1',  emoji: '⚽', grad: 'linear-gradient(135deg,#002200,#005500)', soon: true },
  WC:   { name: 'World Cup',       short: 'WC',  emoji: '🏆', grad: 'linear-gradient(135deg,#662200,#aa4400)' },
    SN:   { name: 'Six Nations',     short: '6N',  emoji: '🏉', grad: 'linear-gradient(135deg,#003300,#006600)', soon: true },
}

// Festive League — a short, self-contained competition over the Christmas matchdays
export const FESTIVE = { from: 17, to: 20, label: 'Festive League', dates: '26 Dec – 7 Jan' }

export const FESTIVE_ROUNDS = { 17: 'Boxing Day', 18: 'Twixmas', 19: 'New Year', 20: 'The Decider' }
// The festive look switches itself off the day after the Festive League ends
export const isFestiveSeason = () => Date.now() < Date.UTC(2027, 0, 8)

// Festive League names for the five chips — same rules, Christmas wrapping
export const FESTIVE_CHIPS = {
  '2x':    { name: 'Double Helpings',     the: 'Double Helpings',      emoji: '🍽️', desc: 'Double your points for every pick in one round.' },
  banker:  { name: 'Star on the Tree',    the: 'the Star on the Tree', emoji: '⭐', desc: 'Triple your points on one specific match.' },
  hth:     { name: 'Half-Time Mince Pie', the: 'the Half-Time Mince Pie', emoji: '🥧', desc: 'Change all your picks at half time for one round.' },
  copycat: { name: 'Secret Santa',        the: 'Secret Santa',         emoji: '🎅', desc: "Quietly copy another player's picks for one round. They won't know." },
  coupon:  { name: 'Christmas Miracle',   the: 'a Christmas Miracle',  emoji: '✨', desc: 'Your worst result of the round is rescued — upgraded to the next points tier.' },
}
// Map of chip id → name to use in sentences ("Leon played …"), festive-aware
export const chipNames = (pool, base) => pool?.format === 'festive'
  ? Object.fromEntries(Object.keys(base).map(id => [id, FESTIVE_CHIPS[id]?.the || base[id]]))
  : base

export const COMP_IDS = { PL: 'PL', CHAMP: 'ELC', L1: 'EL1', WC: 'WC', SN: null }

export const SAMPLE_FIXTURES = [
  { id: 'f1', home: 'Arsenal',   away: 'Coventry City', kickoff: '2025-08-21T19:00:00Z', matchday: 1 },
  { id: 'f2', home: 'Hull City', away: 'Man United',    kickoff: '2025-08-22T11:30:00Z', matchday: 1 },
  { id: 'f3', home: 'Liverpool', away: 'Brentford',     kickoff: '2025-08-22T14:00:00Z', matchday: 1 },
]

export const CHIPS = [
  { id: '2x',     name: '2x Multiplier',  color: '#FFD700', warning: 'Once per season.'  },
  { id: 'banker', name: 'Banker',          color: '#4499FF', warning: 'Once per month.'   },
  { id: 'hth',    name: 'Half Time Hero',  color: '#9966FF', warning: 'Once per season.'  },
  { id: 'copycat',name: 'Copycat',         color: '#00CCDD', warning: 'Once per season.'  },
]
export const ACCENTS = ['#00E05A', '#FFD60A', '#FF3B5C', '#4499FF', '#9966FF', '#FF6600', '#00CCDD', '#FF4D9E']

