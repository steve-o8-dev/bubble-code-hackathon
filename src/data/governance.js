// MAS FEAT principles mapping + audit trail records — presentation only.
// FEAT = Fairness, Ethics, Accountability, Transparency (MAS guidelines on the
// responsible use of AI & data analytics in Singapore's financial sector).

export const featPrinciples = [
  {
    key: 'F',
    name: 'Fairness',
    color: 'good',
    statement: 'Recommendations are ranked on client needs, not on product payout.',
    controls: [
      'Ranking model excludes commission/payout tier from scoring',
      'Same needs-fit logic applied to every client',
      'Bias check: outputs reviewed for systematic skew',
    ],
  },
  {
    key: 'E',
    name: 'Ethics',
    color: 'info',
    statement: 'Exclusions and tradeoffs are surfaced honestly — no fine print buried.',
    controls: [
      'Every exclusion flagged with severity',
      'Tradeoffs shown alongside every recommendation',
      'Plain-language output to avoid misleading clients',
    ],
  },
  {
    key: 'A',
    name: 'Accountability',
    color: 'warn',
    statement: 'A licensed consultant approves every recommendation before it reaches the client.',
    controls: [
      'Human-in-the-loop approval gate (MAS-licensed FR)',
      'Immutable audit trail of every agent action',
      'Consultant identity recorded on each approval',
    ],
  },
  {
    key: 'T',
    name: 'Transparency',
    color: 'bad',
    statement: 'Every output carries sources and a confidence score.',
    controls: [
      'Source document references on each claim',
      'Confidence score per output; low scores flagged for review',
      'Decision rationale captured in plain English',
    ],
  },
]

export const auditTrail = [
  {
    id: 'AUD-2026-0612-014',
    time: '2026-06-12 14:32 SGT',
    agent: 'Recommend',
    actor: 'AI Agent',
    client: 'Tan Wei Ming (CL-1001)',
    action: 'Generated ranked shortlist (3 products)',
    detail: 'Ranked by needs-fit; payout tier excluded from scoring',
    confidence: 90,
    feat: ['F', 'T'],
    status: 'Pending approval',
  },
  {
    id: 'AUD-2026-0612-013',
    time: '2026-06-12 14:31 SGT',
    agent: 'Discover',
    actor: 'AI Agent',
    client: 'Tan Wei Ming (CL-1001)',
    action: 'Pulled client data via MCP (NRIC S8123456A)',
    detail: 'Source: Singpass Myinfo; 4 coverage gaps identified',
    confidence: 92,
    feat: ['E', 'T'],
    status: 'Logged',
  },
  {
    id: 'AUD-2026-0612-012',
    time: '2026-06-12 11:08 SGT',
    agent: 'Simplify',
    actor: 'AI Agent',
    client: '—',
    action: 'Simplified policy PRUShield Plus (PRU/IP/PSP/2026-v3)',
    detail: '4 exclusions flagged honestly; 3 key terms explained',
    confidence: 96,
    feat: ['E', 'T'],
    status: 'Logged',
  },
  {
    id: 'AUD-2026-0611-009',
    time: '2026-06-11 16:45 SGT',
    agent: 'Recommend',
    actor: 'Jame (FR)',
    client: 'Lim Hui Fang (CL-1004)',
    action: 'Approved shortlist with adjustment',
    detail: 'Consultant down-ranked ILP; capital-guaranteed plan kept #1',
    confidence: 88,
    feat: ['A', 'F'],
    status: 'Approved',
  },
  {
    id: 'AUD-2026-0609-004',
    time: '2026-06-09 10:21 SGT',
    agent: 'Recommend',
    actor: 'Jame (FR)',
    client: 'Rajesh Kumar (CL-1003)',
    action: 'Approved & delivered to client',
    detail: 'Legacy income plan approved; rationale logged',
    confidence: 89,
    feat: ['A', 'T'],
    status: 'Delivered',
  },
]
