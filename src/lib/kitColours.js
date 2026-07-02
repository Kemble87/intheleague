// Primary and secondary colours for PL teams
export const KIT_COLOURS = {
  // Team name (as it appears from football-data.org shortName) -> [primary, secondary, pattern]
  'Arsenal':        { home: '#EF0107', away: '#ffffff', sash: null, sleeves: '#ffffff' },
  'Aston Villa':    { home: '#670E36', away: '#95BFE5', sash: null },
  'Bournemouth':    { home: '#DA291C', away: '#000000', sash: 'stripes' },
  'Brentford':      { home: '#E30613', away: '#FFFFFF', sash: 'stripes' },
  'Brighton':       { home: '#0057B8', away: '#FFFFFF', sash: 'stripes' },
  'Chelsea':        { home: '#034694', away: '#FFFFFF', sash: null },
  'Crystal Palace': { home: '#1B458F', away: '#C4122E', sash: 'sash' },
  'Everton':        { home: '#003399', away: '#FFFFFF', sash: null },
  'Fulham':         { home: '#FFFFFF', away: '#000000', sash: null },
  'Ipswich':        { home: '#0044A9', away: '#FFFFFF', sash: null },
  'Leicester':      { home: '#003090', away: '#FFFFFF', sash: null },
  'Liverpool':      { home: '#C8102E', away: '#00A398', sash: null },
  'Man City':       { home: '#6CABDD', away: '#FFFFFF', sash: null },
  'Man United':     { home: '#DA291C', away: '#FFFFFF', sash: null },
  'Newcastle':      { home: '#ffffff', away: '#141414', sash: 'stripes' },
  'Nottm Forest':   { home: '#DD0000', away: '#FFFFFF', sash: null },
  'Nottingham':     { home: '#DD0000', away: '#FFFFFF', sash: null },
  'Nott\'m Forest':  { home: '#DD0000', away: '#FFFFFF', sash: null },
  'Southampton':    { home: '#D71920', away: '#130C0E', sash: 'stripes' },
  'Spurs':          { home: '#FFFFFF', away: '#001333', sash: null },
  'Tottenham':      { home: '#FFFFFF', away: '#001333', sash: null },
  'West Ham':       { home: '#7A263A', away: '#1BB1E7', sash: null },
  'Wolves':         { home: '#FDB913', away: '#231F20', sash: null },
  // Championship
  'Hull City':      { home: '#F5A12D', away: '#000000', sash: null },
  'Coventry City':  { home: '#58AFDB', away: '#FFFFFF', sash: null },
  'Sunderland':     { home: '#EB172B', away: '#FFFFFF', sash: 'stripes' },
  'Leeds United':   { home: '#FFFFFF', away: '#1D428A', sash: null },
  'Middlesbrough':  { home: '#E41B17', away: '#FFFFFF', sash: null },
  'Sheffield Utd':  { home: '#EE2737', away: '#FFFFFF', sash: 'stripes' },
  'Burnley':        { home: '#6C1D45', away: '#99D6EA', sash: null },
  'Norwich':        { home: '#00A650', away: '#FFF200', sash: null },
  'Watford':        { home: '#FBEE23', away: '#ED2127', sash: null },
  'Millwall':       { home: '#001D5E', away: '#FFFFFF', sash: null },
}

export function getKit(teamName) {
  if (!teamName) return null
  // Try exact match first
  if (KIT_COLOURS[teamName]) return KIT_COLOURS[teamName]
  // Try partial match
  const key = Object.keys(KIT_COLOURS).find(k => 
    teamName.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(teamName.toLowerCase())
  )
  return key ? KIT_COLOURS[key] : null
}
