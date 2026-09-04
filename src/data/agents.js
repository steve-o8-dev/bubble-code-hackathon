// Agent metadata and the SKILLS.md rulesets surfaced in SkillCard.

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
