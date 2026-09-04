# CLAUDE.md

Guidance for working in this repo. Read this first.

## What this is

**PRU.NAVIGATOR** — a hackathon **pitch/demo prototype** for the PolyFinTech API100
Hackathon 2026 (concept for Prudential). It's a single-page **React + Vite + Tailwind**
front-end that *simulates* how 3 insurance AI agents would assist a financial
representative (FR).

**There is no backend, no real AI, no real MCP server.** Every output is hardcoded in
`src/data/`. The "agent runs" are scripted, timed animations. Tagline driving the whole
concept: *"AI prepares. The consultant decides. The customer wins."*

This is for **presentation only** — optimise for what looks good and tells the story in a
live demo, not for production correctness, persistence, or real integrations.

## Run it

```bash
npm install
npm run dev      # vite, opens http://localhost:5173 automatically
npm run build    # production build
npm run preview  # preview the build
```

No tests, no linter configured. No backend to start.

## The 3-engine concept (the core narrative)

The primary user is a **MAS-licensed Financial Representative** (consultant). MAS rules
mean only a licensed human can make a recommendation, so the product is **human-in-the-loop**:
AI prepares & shortlists, the consultant reviews/adjusts/approves. Everything is framed
around **MAS FEAT** (Fairness, Ethics, Accountability, Transparency) and an audit trail.

Each agent follows the same simulated flow: *read SKILLS.md → connect MCP → pull record by
ID → analyse → produce output + confidence score*.

| Agent | Role | Page | Input | Output |
|-------|------|------|-------|--------|
| **Simplify** | Policy Explainer | `/simplify` | a policy **or an uploaded PDF** | plain-English Covered / Not covered / Exclusions / Key terms + confidence |
| **Discover** | Needs Profiler | `/discover` | a client (Singpass NRIC) | Singpass profile, holistic 10-pillar coverage map, gaps, follow-up questions |
| **Recommend** | Decision Aid | `/recommend` | a client w/ needs profile | ranked side-by-side product shortlist → **consultant approval gate** |

Intended demo "killer flow": Discover a client → hand off to Recommend → consultant approves.
The Discover result page has a button that routes to `/recommend` with the client preselected
(which auto-starts the run).

## Architecture & layout

```
index.html              # loads Inter + JetBrains Mono from Google Fonts
src/
  main.jsx              # ReactDOM root + BrowserRouter
  App.jsx              # routes: / (Dashboard), /simplify, /discover, /recommend, /audit
  index.css            # Tailwind + @layer component classes (.card, .btn-primary, .chip, .label-kicker ...)
  components/
    Layout.jsx         # sidebar nav + top header (consultant identity, "Agents online" status) + footer
    LoadingOverlay.jsx # full-screen dimmed loading state during an agent run (see below)
    SkillCard.jsx      # renders an agent's SKILLS.md ruleset panel
    Icon.jsx           # inline-SVG icon set, no icon dependency. Add new icons to the `paths` map
    ui.jsx             # shared primitives: Badge, SeverityTag, ConfidenceMeter, ConfidenceBar, SourceChip, SectionTitle, Stat
  pages/
    Dashboard.jsx      # hero, KPIs, agent entry cards, recent clients/policies, recent activity
    Simplify.jsx       # 3-phase + 3 source tabs (catalogue / upload / history)
    Discover.jsx       # 3-phase: select → running → result (incl. HolisticMap)
    Recommend.jsx      # 3-phase + approval gate
    AuditTrail.jsx     # FEAT principles + audit log table
  data/                # ALL content lives here (hardcoded) — see below
skills/                # the SKILLS.md rulesets each agent "reads" (markdown, displayed conceptually)
public/pru-favicon.svg
```

### Data files (`src/data/`) — this is where you edit content

- **`clients.js`** — 5 clients (`CL-1001`..`CL-1005`) with Singpass-style fields, existing
  coverage, priorities. `getClient(id)`.
- **`policies.js`** — 5 Prudential policies. Each has `raw` (dense policy language),
  `covered`, `notCovered`, `exclusions` (with `severity`), `keyTerms`, `confidence`.
  `getPolicy(id)`.
- **`products.js`** — 7-product catalogue for Recommend. Note `payoutTier` exists but is
  **deliberately excluded from ranking** (the Fairness story). `getProduct(id)`.
- **`analysis.js`** — pre-computed per-client agent outputs:
  - `analysisByClient[clientId].discover` — needs profile, strengths, gaps, follow-up questions
  - `analysisByClient[clientId].recommend` — ranked `shortlist` (by `needsFitScore`, never payout)
  - `coverageMapByClient` + `pillars` + `statusMeta` — the holistic 10-pillar FNA map
  - helpers: `getAnalysis(id)`, `getCoverageMap(id)`
- **`agents.js`** — agent metadata, the `skills` ruleset objects shown in SkillCard, and the
  `consultant` identity (Jame).
- **`governance.js`** — `featPrinciples` (F/E/A/T) and the `auditTrail` log rows.
- **`history.js`** — recent **Simplify** runs only, persisted to `localStorage` (the router
  remounts pages on every navigation, so in-memory history would not survive). Seeded with
  3 fake past runs so the History tab is never empty in a demo. Uploaded `File` objects
  can't be serialised, so an entry stores the resolved identity and
  `policyFromHistory()` in `policies.js` rebuilds the full record.

**Data is wired by ID.** Client IDs, policy IDs, product IDs, and `productId` references in
the shortlists must stay consistent across files or lookups return `undefined` and the page
crashes. If you add a client, add matching `discover` + `recommend` entries in `analysis.js`
and a `coverageMapByClient` entry, or guard the access.

## How the agent simulation works

Each page is a small state machine on `phase`: `select → running → result`. The selection
UI stays mounted through `running`; the `running` phase additionally mounts
`LoadingOverlay` ([src/components/LoadingOverlay.jsx](src/components/LoadingOverlay.jsx)),
which dims the whole viewport and centres a spinner, then calls `onDone` to flip `phase` to
`result`.

The overlay eases in over 500ms, holds for `durationMs` (default 2500), then eases out over
200ms before `onDone` fires. To change pacing, pass `durationMs`. Note the fade-in is
triggered by a 20ms `setTimeout` rather than `requestAnimationFrame` — rAF does not fire on
a tab that isn't painting, which would leave the overlay stuck invisible.

## Styling conventions

- **Tailwind**, theme extended in [tailwind.config.js](tailwind.config.js). Brand palette is
  namespaced `pru-*` (`pru-red #ED1B2E`, `pru-ink`, `pru-slate`, `pru-mist`, `pru-line`).
  Semantic colors: `good` (green), `warn` (amber), `bad` (red), `info` (blue), each with a
  `-soft` variant.
- Reusable component classes live in `index.css` `@layer components`: `.card`, `.btn`,
  `.btn-primary`, `.btn-ghost`, `.btn-dark`, `.chip`, `.label-kicker`. Prefer these over
  re-deriving the same utility strings.
- Dynamic class names like `bg-${f.color}` / `text-${f.color}` are used in AuditTrail and
  Discover — these are covered by the `safelist` in tailwind.config. **If you introduce a new
  dynamically-constructed color class, add it to the safelist** or Tailwind will purge it.
- Confidence/score bands are repeated logic (≥90 green, ≥80 amber, else red). See
  `ConfidenceMeter`/`ConfidenceBar` in `ui.jsx`.

## Working notes / gotchas

- Singapore context throughout: SGD currency (`S$`), Singpass/Myinfo, MediShield/Integrated
  Shield, CPF (OA/SA/MA), MAS FEAT. Keep terminology consistent when adding content.
- Money is formatted ad hoc per page (`sgd()` in Discover, `money()` in Recommend) — not a
  shared util.
- Routing carries state: Dashboard buttons navigate with `{ state: { clientId } }` /
  `{ policyId }`; Recommend auto-starts (`phase: 'running'`) when arriving with a `clientId`.
- It's a demo — there's no error handling for unknown IDs. Keep the data consistent rather
  than adding guards, unless a guard is the quickest path to a stable demo.
