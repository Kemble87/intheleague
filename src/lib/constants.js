export const SPORTS = {
  PL:   { name: 'Premier League',  short: 'PL',  emoji: '⚽', grad: 'linear-gradient(135deg,#3d0066,#6600aa)' },
  CHAMP:{ name: 'Championship',    short: 'CH',  emoji: '⚽', grad: 'linear-gradient(135deg,#003366,#0055aa)' },
    L1:   { name: 'League One',      short: 'L1',  emoji: '⚽', grad: 'linear-gradient(135deg,#002200,#005500)', soon: true },
  WC:   { name: 'World Cup',       short: 'WC',  emoji: '🏆', grad: 'linear-gradient(135deg,#662200,#aa4400)' },
    SN:   { name: 'Six Nations',     short: '6N',  emoji: '🏉', grad: 'linear-gradient(135deg,#003300,#006600)', soon: true },
}

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
