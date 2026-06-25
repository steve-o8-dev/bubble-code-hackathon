// Agent metadata, SKILLS.md content, and the animated run steps shown during
// "Start Analysis". Steps are purely visual (with simulated latency).

export const consultant = {
  name: 'Jame',
  title: 'Senior Financial Representative',
  masRep: 'MAS Rep ID: PRU-FR-20413',
  branch: 'Prudential @ Marina One',
  initials: 'J',
}

export const skills = {
  simplify: {
    file: 'simplify.SKILLS.md',
    purpose: 'Turn dense Prudential policy documents into honest plain-English breakdowns.',
    rules: [
      'Read the full policy document pulled via MCP by policy ID.',
      'Separate content into: Covered / Not Covered / Exclusions / Key Terms.',
      'Flag every exclusion honestly — never bury fine print.',
      'Rewrite jargon at an 8th-grade reading level.',
      'Cite the source document reference for each claim.',
      'Output a confidence score; flag for human review if < 80%.',
    ],
  },
  discover: {
    file: 'discover.SKILLS.md',
    purpose: 'Build a complete client needs profile and surface coverage gaps.',
    rules: [
      'Pull verified client data via MCP by NRIC (Singpass Myinfo source).',
      'Assess ALL protection & wealth pillars (holistic FNA) — not just obvious gaps.',
      'Compare coverage owned vs coverage needed by life stage.',
      'Quantify each gap with an estimated shortfall value.',
      'Generate 2–3 thoughtful follow-up questions for what is missing.',
      'Never invent data — only reason over pulled, sourced fields.',
      'Output a confidence score; flag low-confidence fields for the FR.',
    ],
  },
  recommend: {
    file: 'recommend.SKILLS.md',
    purpose: 'Produce a ranked, compared shortlist of suitable Prudential products.',
    rules: [
      'Rank strictly by fit to the client needs profile — never by commission/payout.',
      'For each product give plain reasons why it fits AND the tradeoffs.',
      'Present the shortlist side-by-side so options can be compared.',
      'Attach source document references and a confidence score per item.',
      'Require consultant review & approval before anything reaches the client.',
      'Map every step to MAS FEAT (Fairness, Ethics, Accountability, Transparency).',
    ],
  },
}

// Generic step builders for the AgentRunner animation.
export const simplifySteps = (policyName, policyId) => [
  { key: 'skills', label: `Reading ${'simplify.SKILLS.md'} instructions`, detail: 'Loading policy-explainer skill ruleset' },
  { key: 'mcp', label: 'Connecting to Policy MCP server', detail: 'mcp://prudential/policy-docs' },
  { key: 'pull', label: `Pulling policy by ID — ${policyId}`, detail: `Fetching "${policyName}" document` },
  { key: 'analyse', label: 'Analysing policy clauses', detail: 'Parsing coverage, exclusions & definitions' },
  { key: 'simplify', label: 'Generating simplified plain-English text', detail: 'Rewriting at 8th-grade reading level' },
  { key: 'confidence', label: 'Rating confidence score', detail: 'Cross-checking against source clauses' },
  { key: 'done', label: 'Summary ready', detail: 'Plain-English breakdown compiled' },
]

export const discoverSteps = (clientName, nric) => [
  { key: 'skills', label: 'Reading discover.SKILLS.md instructions', detail: 'Loading needs-discovery skill ruleset' },
  { key: 'mcp', label: 'Connecting to Client MCP server', detail: 'mcp://prudential/client-singpass' },
  { key: 'pull', label: `Pulling client data by NRIC — ${nric}`, detail: `Singpass Myinfo profile for ${clientName}` },
  { key: 'analyse', label: 'Running holistic needs analysis', detail: 'Assessing all 10 protection & wealth pillars' },
  { key: 'gaps', label: 'Generating coverage-gap summary', detail: 'Quantifying shortfalls' },
  { key: 'questions', label: 'Generating follow-up questions', detail: 'Drafting questions for missing info' },
  { key: 'confidence', label: 'Rating confidence score', detail: 'Validating against sourced fields' },
  { key: 'done', label: 'Coverage data & questions ready', detail: 'Client needs profile compiled' },
]

export const recommendSteps = (clientName) => [
  { key: 'skills', label: 'Reading recommend.SKILLS.md instructions', detail: 'Loading decision-aid skill ruleset' },
  { key: 'mcp', label: 'Connecting to Product & Needs MCP', detail: 'mcp://prudential/product-catalogue' },
  { key: 'profile', label: `Loading needs profile — ${clientName}`, detail: 'Importing Discover Agent output' },
  { key: 'match', label: 'Matching products to client needs', detail: 'Scoring fit per pillar (not by payout)' },
  { key: 'rank', label: 'Ranking & compiling tradeoffs', detail: 'Building side-by-side comparison' },
  { key: 'confidence', label: 'Rating confidence & attaching sources', detail: 'Mapping to MAS FEAT guidelines' },
  { key: 'done', label: 'Shortlist ready for consultant review', detail: 'Awaiting human approval' },
]
