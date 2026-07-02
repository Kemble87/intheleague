# InTheLeague

Private sports score prediction platform for friend groups.

## Stack
- **Frontend:** React 18 + Vite
- **Backend:** Firebase (Auth, Firestore, Realtime Database)
- **Hosting:** Netlify (auto-deploys from GitHub)
- **Fixtures API:** football-data.org

## Local Development

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub — Netlify auto-deploys on every push to `main`.

## Environment Variables (Netlify)

Set in Netlify → Site configuration → Environment variables:

| Key | Value |
|-----|-------|
| `FOOTBALL_DATA_API_KEY` | Your football-data.org API key |

## Project Structure

```
src/
  components/
    Login.jsx        # Auth screen (Google + email)
    Dashboard.jsx    # Pool list, create/join pools
    PoolView.jsx     # Pool container (picks + leaderboard)
    Fixtures.jsx     # Fixture cards, predictions, matchday summary
    Chips.jsx        # Power-up chip badges
    NavMenu.jsx      # Top right dropdown menu
  lib/
    firebase.js      # Firebase init
    constants.js     # Sports, sample fixtures, chip defs
    helpers.js       # Date formatting, scoring, fixture fetching
  styles/
    global.css       # All styles
  App.jsx            # Root — auth state, routing
  main.jsx           # Entry point
netlify/
  functions/
    fixtures.js      # Serverless proxy for football-data.org
```
