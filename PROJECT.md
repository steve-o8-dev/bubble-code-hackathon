# PRU.NAVIGATOR — Project Document

**An Agentic AI Insurance Advisory Ecosystem**
PolyFinTech API100 Hackathon 2026 · Concept prototype for Prudential Singapore

> *"AI prepares. The consultant decides. The customer wins."*

---

## 1. The brief

> How might we design an agentic AI "Insurance Navigator" that helps people understand
> and compare insurance coverage by simplifying policy language, asking thoughtful
> questions, and supporting financial representatives in recommending suitable options?

Three verbs sit in that brief — **simplify**, **ask**, **support**. We took them literally
and built one agent for each. That is the whole architecture, and it is why the concept is
easy to explain in a single breath.

---

## 2. Who we are building for

**Primary user: the Prudential Financial Representative (FR).** Not the end customer.

That choice is the most important decision in this project, and it was not the obvious one.
A consumer-facing "explain my insurance" chatbot is the easier demo. We went the other way
for two reasons:

**The regulatory reason.** Under MAS rules, only a licensed person can make a financial
recommendation. An AI that recommends a product to a consumer is either breaking that rule
or pretending not to be a recommendation. Neither is a business Prudential can run. Putting
a licensed human in the decision seat is not a compromise — it is the only shape this
product can legally take.

**The value reason.** The FR is where the pain actually is:

| | |
|---|---|
| Manages | 10–30 active clients at any time |
| Prep per client meeting | **2–3 hours** |
| What that time goes on | Reading policy docs → guessing at coverage gaps → building a product comparison from scratch |
| Accountable for | Every recommendation they make, under their MAS licence |

Three hours of unpaid, unglamorous, error-prone preparation before every meeting — repeated
across a whole distribution force. That is a cost centre with a clear ceiling on quality,
and it is exactly the shape of problem an agent is good at.

---

## 3. Ideation — how we got here

The reasoning chain, in order:

**"Insurance is confusing" is not a problem statement.** It is a symptom. We pushed until we
found something with an owner and a clock on it: an FR spends 2–3 hours preparing for each
client meeting, and the quality of that prep varies by individual.

**The bottleneck is preparation, not conversation.** FRs are good at the client conversation.
What they lack is time and consistent raw material going into it. So the product should not
try to replace the conversation — it should arrive at the conversation with the homework
already done.

**Human-in-the-loop is the feature, not the disclaimer.** Once we accepted the MAS
constraint, it stopped being a limitation and became the product's spine. The consultant
approval gate is the moment the whole pitch turns on: the AI has done the work, and a
licensed human decides. Every screen was then designed backwards from that moment.

**One agent per verb.** Rather than a monolithic assistant, three narrow agents, each with
its own ruleset, its own input, its own confidence score, and its own place in the workflow.
Narrow agents are easier to trust, easier to audit, and — critically for a pitch — easier to
demo one at a time.

**Trust is a UI problem as much as a model problem.** Sources on every claim, a confidence
score on every output, exclusions surfaced rather than buried, and the payout tier visibly
excluded from ranking. If a consultant cannot see why the AI said something, they cannot
put their licence behind it.

---

## 4. The three engines

Each agent follows the same conceptual loop: **read its SKILLS.md → connect to MCP → pull
the record by ID → analyse → produce output + confidence score.**

### Simplify — Policy Explainer

**In:** a Prudential policy, *or* an uploaded PDF from any insurer.
**Out:** plain-English Covered / Not covered / Exclusions / Key terms, plus confidence.

Rewrites dense policy language at roughly an 8th-grade reading level and flags every
exclusion with a severity. The original clause is kept on screen beside the simplification
so nothing is taken on faith.

### Discover — Needs Profiler

**In:** a client, identified by Singpass NRIC.
**Out:** verified profile, a 10-pillar coverage map, quantified gaps, follow-up questions.

Instead of a long intake form, the client logs in via Singpass and income, CPF, dependants
and housing auto-populate. The agent then assesses **all ten** protection and wealth pillars
— not just the obvious gaps — and drafts the 2–3 questions the consultant should actually
ask about what is missing.

The ten pillars: Life/Income Replacement · Disability (TPD) · Critical Illness ·
Hospitalisation & Medical · Disability Income · Retirement Adequacy · Savings & Wealth ·
Children Education · Legacy & Estate · Emergency/Debt Cover.

### Recommend — Decision Aid

**In:** a client with a completed needs profile.
**Out:** a ranked, side-by-side shortlist → **consultant approval gate**.

Each option carries plain reasons why it fits, the tradeoffs, matched needs, sources and a
confidence score. Ranking is strictly by fit to the needs profile. Nothing reaches the
client until the consultant approves, and that approval is recorded against their MAS Rep ID.

---

## 5. The killer demo flow

One path proves the entire concept:

```
Dashboard
   │
   ├─ Pick a client ──────────► DISCOVER
   │                            Singpass pull → 10-pillar map → gaps → questions
   │                                     │
   │                                     ▼  "Run Recommend Agent"
   │                            RECOMMEND (auto-starts, client pre-selected)
   │                            ranked shortlist → side-by-side → comparison matrix
   │                                     │
   │                                     ▼
   │                            ✋ CONSULTANT APPROVAL GATE
   │                                     │
   │                                     ▼
   └─ Any policy ─────────────► AUDIT TRAIL (FEAT-mapped, immutable)
                                SIMPLIFY runs independently
```

The handoff is the moment worth pausing on in a live pitch: the Discover result page routes
straight into Recommend with the client already selected and the run already started. Two
agents, one continuous motion, no re-keying.

---

## 6. Design decisions worth defending

These are the choices a judge is most likely to probe.

### Payout tier is deliberately excluded from ranking

Every product carries a `payoutTier` field. It is **never** an input to `needsFitScore`. The
comparison matrix displays it anyway, in a row explicitly labelled *"Payout tier (ignored in
ranking)"*.

Showing the excluded variable is stronger than hiding it. It converts a claim ("we rank
fairly") into something the audience can verify on screen. This is MAS FEAT · Fairness, made
visible.

### Prudential policies are *verified*; uploads are *AI-analysed*

Prudential's own policies ship with an approved plain-English breakdown — a human has
already signed it off. Generating that text fresh from a model on every view would add
inference cost, add hallucination risk, and add nothing.

So the two paths are treated differently:

| | Prudential catalogue | Uploaded PDF |
|---|---|---|
| Action | **View breakdown** | **Analyse document** |
| Result badge | Prudential verified | Uploaded · AI-analysed |
| Confidence | High, pre-approved | Scored, lower when unrecognised |
| Runtime inference cost | None — pre-computed and cached | Billed per run |

This single decision is what keeps inference at roughly 1% of the running cost. **The
architecture and the cost model are the same argument.**

### Unrecognised documents return *lower* confidence, on purpose

When an uploaded file matches a known Prudential product by filename, the agent applies that
product's full breakdown. When it does not, it falls back to a generic read at **84%**
confidence — the amber "Moderate" band — with a visible warning to verify against the source
before advising.

A system that is confident about everything is not trustworthy. Showing the agent being
appropriately unsure about an unfamiliar document is a feature.

### The loading state is a dimmed overlay, not a terminal

An earlier build showed a console-style log — `$ Reading simplify.SKILLS.md…`, spinner-to-check
ticks, a progress bar. It was replaced with a full-screen dimmed overlay and a centred
spinner.

The console was engineer-facing theatre. The user of this product is a financial consultant,
not a developer, and a black terminal window on screen quietly says "this is a developer
tool" at exactly the moment you want it to say "this is doing your work for you."

### History exists because the router discards state

Recent Simplify analyses persist to `localStorage`. This is not polish: the router remounts
every page on navigation (`<Routes key={location.key}>`), so in-memory history would be wiped
the moment a consultant clicked away and back. It also survives a mid-demo reload, and it is
seeded with past runs so the tab is never empty on stage.

---

## 7. Governance — MAS FEAT and PDPA

The platform is mapped to MAS's **FEAT** principles (Fairness, Ethics, Accountability,
Transparency), issued in 2018 for the responsible use of AI and data analytics in Singapore's
financial sector.

| Principle | How it shows up in the product |
|---|---|
| **Fairness** | Ranking excludes payout tier; identical needs-fit logic for every client |
| **Ethics** | Every exclusion flagged with severity; tradeoffs shown beside every recommendation |
| **Accountability** | Licensed-FR approval gate; immutable audit trail; consultant identity on each approval |
| **Transparency** | Source document reference on every claim; confidence score per output; rationale in plain English |

**What production would additionally need:**

- **PDPA** — a Data Protection Impact Assessment across the Singpass/Myinfo and client-data
  flows, an appointed DPO, consent architecture, and data residency. Maximum financial
  penalty is **S$1M or 10% of annual Singapore turnover, whichever is higher**, for
  organisations above S$10M turnover. It applies to negligent, not accidental, breaches.
- **MAS Guidelines on AI Risk Management** — consultation closed November 2025; these become
  supervisory expectations and are assessed at inspection.
- **Veritas Toolkit 2.0** — the assessment methodology for evidencing all fourteen FEAT
  principles.

---

## 8. Cost model

Full detail lives in `PRU-NAVIGATOR-Cost-Estimate.pptx`. Summary:

**Build to pilot — 8 months, 30 consultants: S$475,000**

| Line | Cost | Share |
|---|---|---|
| Engineering team, 5 FTE | S$236,000 | 50% |
| PDPA & MAS FEAT compliance | S$95,000 | 20% |
| Myinfo integration & penetration test | S$45,000 | 9% |
| Pilot programme, 30 FRs | S$28,000 | 6% |
| Cloud & LLM inference | S$9,000 | 2% |
| Contingency @ 15% | S$62,000 | 13% |

**Running cost**

| | Pilot (30 FRs) | At scale (200 FRs) |
|---|---|---|
| Per year | S$170,000 | S$205,000 |
| Per consultant | S$5,667 | **S$1,025** |

Compliance and the core team are fixed; only infrastructure and inference scale. The pilot
roughly breaks even on its running cost, and the build is recovered within about seven months
of scaling to 200 consultants.

**Known risk:** the model assumes a S$5,000/month developer average. That is realistic for
Singapore's 0–2 year band (market range S$4,000–6,500) but below the overall average of
S$6,000–7,000 and well below senior at ~S$8,200. It is a junior-weighted team for a regulated
build. The contingency is sized to absorb a senior contractor through the compliance-critical
stretch.

Not included, and needing real quotes: Singpass/Myinfo commercial API fees, Prudential's
internal vendor-onboarding overhead, and professional indemnity cover for AI-assisted advice.

---

## 9. What is real and what is simulated

**Stated plainly, because a judge will ask.**

This is a **presentation prototype**. There is no backend, no live AI, and no real MCP
server. Every output is hardcoded in `src/data/`, and the agent runs are timed animations.

| Element | Status |
|---|---|
| UI, flows, state machines, interaction design | **Real** — fully built and working |
| Uploaded file handling — name, size, type and size validation | **Real** |
| History persistence across navigation and reload | **Real** — localStorage |
| Agent reasoning and all outputs | **Simulated** — pre-written per client and policy |
| Singpass/Myinfo pull | **Simulated** — no integration |
| MCP servers, SKILLS.md execution | **Conceptual** — the rulesets are displayed, not executed |
| Audit trail | **Simulated** — static rows, not written by real runs |
| PDF parsing | **Not implemented** — uploads resolve by filename match, else a generic read |

What the prototype genuinely validates is the **experience and the workflow** — whether this
shape of tool makes sense to a consultant, and whether the handoff and approval gate feel
right. That is the correct thing to test before spending S$475K.

---

## 10. Architecture

### Current prototype

```
React 18 · Vite 5 · Tailwind 3 · react-router-dom 6      (no other dependencies)

src/
  App.jsx              routes, keyed on location.key so pages reset on navigation
  components/
    Layout.jsx         sidebar, header with consultant identity, footer
    LoadingOverlay.jsx full-screen dimmed agent-run state
    SkillCard.jsx      the agent's SKILLS.md ruleset panel
    Icon.jsx           inline SVG set, no icon dependency
    ui.jsx             Badge, SeverityTag, ConfidenceMeter, ConfidenceBar, SourceChip…
  pages/
    Dashboard · Simplify · Discover · Recommend · AuditTrail
  data/                all content — 5 clients, 5 policies, 7 products,
                       per-client analyses, coverage maps, FEAT + audit rows, history
skills/                the three SKILLS.md rulesets
```

Every agent page is a three-phase state machine: `select → running → result`.

### What production would look like

```
Consultant browser
      │
      ▼
Application layer ──── agent orchestration, approval gate, audit writer
      │
      ├──► Claude API              Simplify / Discover / Recommend
      │                            prompt caching · Batch API for catalogue pre-compute
      ├──► MCP: policy documents   Prudential document store
      ├──► MCP: client Singpass    Myinfo — income, CPF, dependants, housing
      ├──► MCP: product catalogue  live product and pricing data
      │
      ▼
Audit store (immutable, FEAT-tagged) · AWS ap-southeast-1
```

---

## 11. Roadmap

**Now — prototype.** Complete: all three agents, the handoff, the approval gate, upload,
history, audit view.

**Next — thin slice.** One agent (Simplify) against the real Claude API with real PDF
parsing, on a real Prudential document set. Validates output quality and true token cost
before committing to the full build.

**Then — pilot.** 30 consultants, 8 months, S$475K. Real Singpass integration, DPIA and FEAT
assessment complete, audit trail writing real events.

**Then — scale.** 200 consultants. Per-consultant cost drops to ~S$1,025/year. Extend the
audit trail into Prudential's existing compliance reporting.

---

## 12. Demo script

Six minutes, in this order:

1. **Dashboard** — set the scene. Three agents, consultant identity top-right, "human-in-the-loop"
   badge in the sidebar. *"This is Jame's morning."*
2. **Simplify → upload tab** — drag in any insurer's PDF. Note the confidence drops for an
   unrecognised document. *"It tells you when it isn't sure."*
3. **Simplify → Prudential tab** — view a verified breakdown. *"Prudential's own policies are
   pre-approved. No AI guessing, no inference cost."*
4. **Discover** — pick Tan Wei Ming. Singpass auto-fill, then the ten-pillar map.
   *"It assessed everything, not just the obvious gap."* Land on the S$840k shortfall.
5. **Hand off to Recommend** — one click, auto-starts. Side-by-side shortlist. Scroll to the
   comparison matrix and point at *"Payout tier (ignored in ranking)."* **This is the moment.**
6. **Approve** — the gate. Then Audit & FEAT to show it logged.

Close on the tagline.

---

## 13. Stakeholder value

**For consultants — no more fine-print surprises.** They can explain exactly what is covered,
what is excluded, and why a product fits. Clearer conversations, backed by sources.

**For clients — less prep, better advice.** Preparation drops from hours to minutes, and the
consultant arrives with tailored insight and a reasoned shortlist. More time on the
relationship, less on admin.

**For Prudential — designed around accountability.** Scalable, compliant advisory. Every
recommendation consultant-approved, every interaction audit-trailed. Quality stays consistent
as distribution grows. Audit-ready, always.

---

*Team Bubblecode · PolyFinTech API100 Hackathon 2026*
