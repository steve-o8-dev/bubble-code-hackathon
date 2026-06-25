# PRU.NAVIGATOR

**An Agentic AI Insurance Advisory Ecosystem** — PolyFinTech API100 Hackathon 2026 concept prototype for Prudential.

> "AI prepares. The consultant decides. The customer wins."

A standalone **React + Tailwind + Vite** front-end built for the pitch. All data is
hardcoded for presentation — there is no backend, real AI, or MCP server. The agent
runs are simulated animations that mirror the intended runtime flow.

## The problem
> How might we design an agentic AI "Insurance Navigator" that helps people understand
> and compare insurance coverage by simplifying policy language, asking thoughtful
> questions, and supporting financial representatives in recommending suitable options?

## 3-Engine Architecture
| Agent | Role | Flow |
|-------|------|------|
| **Simplify** | Policy Explainer | Dashboard → pick policy → *read SKILLS.md → MCP → pull policy by ID → analyse → simplify → confidence* → plain-English breakdown |
| **Discover** | Needs Profiler | Dashboard → pick client → *read SKILLS.md → MCP → pull client by NRIC (Singpass) → analyse → gaps → questions → confidence* → coverage gaps + follow-up questions |
| **Recommend** | Decision Aid | Needs profile → *read SKILLS.md → MCP → match → rank → confidence* → side-by-side shortlist → **consultant approves** |

## Built around accountability (MAS FEAT)
- Answers backed by **real sources** (document refs on every claim)
- **Confidence scores** on every output
- Ranked on **what the client needs, not what pays the most**
- **Consultant approves** before anything reaches the client (human-in-the-loop)
- Full **audit trail**, mapped to MAS FEAT (Fairness, Ethics, Accountability, Transparency)

## Run it
```bash
npm install
npm run dev
```
Open http://localhost:5173

## Structure
```
src/
  data/        hardcoded records (5 clients, 5 policies, 7 products, analyses, governance)
  components/  Layout, AgentRunner (animation), SkillCard, Icon, ui primitives
  pages/       Dashboard, Simplify, Discover, Recommend, AuditTrail
skills/        the SKILLS.md rulesets each agent "reads"
```

Theme: Prudential red `#ED1B2E` with deep ink, white and semantic accents.
