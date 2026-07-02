exports.handler = async function(event) {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY
  if (!API_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
  const { comp, season } = event.queryStringParameters || {}
  if (!comp) return { statusCode: 400, body: JSON.stringify({ error: 'Missing comp' }) }
  const urls = [
    `https://api.football-data.org/v4/competitions/${comp}/matches`,
    `https://api.football-data.org/v4/competitions/${comp}/matches?season=${season || '2025'}`,
    `https://api.football-data.org/v4/competitions/${comp}/matches?season=2024`,
  ]
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } })
      const text = await res.text()
      if (!res.ok) continue
      const data = JSON.parse(text)
      if (data.matches && data.matches.length > 0) {
        return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) }
      }
    } catch (e) { continue }
  }
  return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ matches: [] }) }
}
