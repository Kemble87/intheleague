import { calcPts, runInMult, runInStart } from '../lib/helpers'
import { SPORTS } from '../lib/constants'

export default function PoolHero({ pool, fixtures, picks, results, members, userId, onOpenPlayers }) {
  const sport = SPORTS[pool.sport] || SPORTS.PL
  // Premium dark gradients — league accent kept subtle
  const DARK_GRADS = {
    PL:    'linear-gradient(150deg,#12081f 0%,#0a0a0a 55%)',
    CHAMP: 'linear-gradient(150deg,#081120 0%,#0a0a0a 55%)',
    L1:    'linear-gradient(150deg,#081408 0%,#0a0a0a 55%)',
    WC:    'linear-gradient(150deg,#1a0f05 0%,#0a0a0a 55%)',
    SN:    'linear-gradient(150deg,#081408 0%,#0a0a0a 55%)',
  }
  const grad = DARK_GRADS[pool.sport] || DARK_GRADS.PL

  // Stats
  const totalPts = (fixtures || []).reduce((s, f) => {
    const p = calcPts(picks[f.id], results[f.id])
    return p != null