// Recent Simplify analyses.
//
// Front-end only, persisted to localStorage. Persistence isn't polish here: the
// router remounts every page on navigation (App.jsx keys <Routes> on
// location.key), so in-memory history would be wiped the moment you click away
// and back. localStorage also survives a mid-demo reload.
//
// Seeded with a few past runs so the History tab is never empty on stage.

const KEY = 'pru-navigator:simplify-history'
const LIMIT = 12

const seeded = [
  {
    key: 'seed-3',
    source: 'catalogue',
    policyId: 'POL-PRUSHIELD-PLUS',
    name: 'PRUShield Plus',
    docRef: 'PRU/IP/PSP/2026-v3',
    confidence: 96,
    at: '2026-06-12T11:08:00+08:00',
  },
  {
    key: 'seed-2',
    source: 'upload',
    matchedId: null,
    name: 'GE-Supreme-Health-2025',
    docRef: 'GE-Supreme-Health-2025.pdf',
    metaLabel: 'Uploaded · 1.8 MB · 11 Jun',
    confidence: 84,
    at: '2026-06-11T15:20:00+08:00',
  },
  {
    key: 'seed-1',
    source: 'catalogue',
    policyId: 'POL-PRUACTIVE-TERM',
    name: 'PRUActive Term',
    docRef: 'PRU/TL/PAT/2026-v2',
    confidence: 94,
    at: '2026-06-11T10:18:00+08:00',
  },
]

// localStorage can throw (private mode, blocked storage) — never let history
// break the page.
const read = () => {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return seeded
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seeded
  } catch {
    return seeded
  }
}

const write = (entries) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    /* storage unavailable — history is best-effort */
  }
}

export const readHistory = () => read()

// Records a finished analysis. Re-running the same document moves it back to
// the top rather than adding a duplicate row.
export const addHistoryEntry = (policy) => {
  const entry = policy.uploaded
    ? {
        key: `h-${Date.now()}`,
        source: 'upload',
        matchedId: policy.matchedId || null,
        name: policy.name,
        docRef: policy.docRef,
        metaLabel: policy.metaLabel,
        confidence: policy.confidence,
        at: new Date().toISOString(),
      }
    : {
        key: `h-${Date.now()}`,
        source: 'catalogue',
        policyId: policy.id,
        name: policy.name,
        docRef: policy.docRef,
        confidence: policy.confidence,
        at: new Date().toISOString(),
      }

  const next = [entry, ...read().filter((e) => e.docRef !== entry.docRef)].slice(0, LIMIT)
  write(next)
  return next
}

export const clearHistory = () => {
  write([])
  return []
}

// "Just now" / "14:32 today" / "11 Jun, 15:20"
export const formatWhen = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const mins = Math.round((Date.now() - d.getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const time = d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false })
  const sameDay = d.toDateString() === new Date().toDateString()
  if (sameDay) return `${time} today`
  return `${d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}, ${time}`
}
