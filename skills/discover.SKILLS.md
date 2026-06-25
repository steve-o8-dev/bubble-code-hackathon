# Discover Agent — SKILLS.md

**Role:** Needs Profiler. Build a complete client needs profile and surface
coverage gaps from verified data.

## Inputs
- `nric` — resolved from the selected client record.

## Tools (MCP)
- `mcp://prudential/client-singpass` → `getClientByNric(nric)`
  (source of truth: Singpass Myinfo — income, CPF, dependents, housing)

## Procedure
1. Read this skill file.
2. Connect to the Client MCP server.
3. Pull the verified client profile by NRIC.
4. Run a **holistic** financial-needs analysis across ALL pillars — life, TPD,
   critical illness, medical, disability income, retirement, savings, education,
   legacy, and emergency/debt liquidity. Rate each: adequate / underinsured / gap / N/A.
5. Compare coverage owned vs coverage needed for the client's life stage.
6. Quantify each gap with an estimated shortfall value, and produce an overall
   protection score.
6. Generate 2–3 thoughtful follow-up questions for what is missing.
7. Never invent data — reason only over pulled, sourced fields.
8. Output a confidence score; flag low-confidence fields for the FR.

## Output contract
```
{ needsProfile, strengths[], gaps[], followUps[], confidence }
```
