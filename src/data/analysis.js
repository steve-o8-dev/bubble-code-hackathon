// Pre-computed agent outputs per client — presentation only.
// `discover` = Discover Agent output (gaps + follow-up questions).
// `recommend` = Recommend Agent output (ranked, compared shortlist).
// Ranking is by needsFitScore, NEVER by product payout tier (FEAT fairness).

export const analysisByClient = {
  'CL-1001': {
    discover: {
      confidence: 92,
      needsProfile: {
        protectionGoal: 'Replace ~10x annual income to protect young family',
        horizon: 'Long term (20+ years)',
        capacity: 'S$650/mo budget, moderate risk',
        topNeed: 'Income protection + hospital upgrade',
      },
      strengths: [
        { item: 'Has employer group term life', detail: 'S$120k baseline death cover in place' },
        { item: 'Healthy CPF balances', detail: 'OA/SA support housing and retirement base' },
      ],
      gaps: [
        { item: 'Severe income-protection shortfall', detail: 'Needs ~S$960k cover; only S$120k group cover (ends if he leaves job)', severity: 'high', gapValue: 'S$840k' },
        { item: 'No private hospital cover', detail: 'On MediShield Life only — large bills exposed for young family', severity: 'high', gapValue: 'Ward A / Private' },
        { item: 'No critical illness cover', detail: 'A CI event would halt income with 2 young children', severity: 'medium', gapValue: 'S$300k' },
        { item: 'No child education funding', detail: 'No earmarked savings for 2 children', severity: 'medium', gapValue: 'S$150k by 2042' },
      ],
      followUps: [
        { q: 'Is your S$120k group cover your only life insurance, or do you hold a personal policy elsewhere?', why: 'Confirms whether the S$840k gap is accurate before sizing cover.' },
        { q: 'If you were hospitalised tomorrow, would you want a private or restructured (A-ward) hospital?', why: 'Determines the right Integrated Shield tier and rider.' },
        { q: 'Roughly what age do you expect your children to enter university, and local or overseas?', why: 'Sizes the education savings target and time horizon.' },
      ],
    },
    recommend: {
      confidence: 90,
      summary:
        'Priority is closing the income-protection and hospitalisation gaps within budget, then layering education savings. Term life chosen over whole life to maximise cover per dollar for a young family.',
      shortlist: [
        {
          rank: 1,
          productId: 'PRD-PRUACTIVE-TERM',
          needsFitScore: 95,
          confidence: 93,
          monthly: 58,
          coverageFor: 'S$900,000 cover to age 65',
          whyItFits: [
            'Closes the S$840k income-protection gap at the lowest cost per dollar of cover',
            'Term to 65 matches his working years and mortgage horizon',
            'Convertible — can switch to whole life later without new health checks',
          ],
          tradeoffs: ['No cash/maturity value — pure protection', 'Cover ends at the chosen term'],
          needsMatched: ['Income protection', 'TPD', 'Terminal illness'],
          sources: ['PRU/TL/PAT/2026-v2', 'Needs analysis CL-1001'],
        },
        {
          rank: 2,
          productId: 'PRD-PRUSHIELD-PLUS',
          needsFitScore: 91,
          confidence: 92,
          monthly: 74,
          coverageFor: 'Private hospital, as-charged + rider',
          whyItFits: [
            'Removes the biggest medical-bill exposure for the family',
            'Rider cuts the S$3,500 deductible and lowers co-insurance to 5%',
            'Covers pre/post hospitalisation and cancer drug list',
          ],
          tradeoffs: ['Premiums rise with age', 'Pre-existing conditions need declaration'],
          needsMatched: ['Hospitalisation', 'Cancer drugs'],
          sources: ['PRU/IP/PSP/2026-v3', 'MOH IP guidelines'],
        },
        {
          rank: 3,
          productId: 'PRD-PRUACTIVE-SAVER',
          needsFitScore: 78,
          confidence: 84,
          monthly: 300,
          coverageFor: 'Education fund, capital-guaranteed',
          whyItFits: [
            'Earmarks a disciplined savings pot for children’s university',
            'Capital guaranteed at maturity aligns with moderate risk appetite',
          ],
          tradeoffs: ['Pushes total spend above stated S$650 budget', 'Low liquidity in early years'],
          needsMatched: ['Education fund', 'Savings'],
          sources: ['PRU/EN/PAS3/2026-v2'],
        },
      ],
    },
  },

  'CL-1002': {
    discover: {
      confidence: 88,
      needsProfile: {
        protectionGoal: 'Critical-illness safety net + start wealth growth',
        horizon: 'Long term',
        capacity: 'S$400/mo, growth-oriented',
        topNeed: 'Critical illness + accumulation',
      },
      strengths: [
        { item: 'Already on PRUShield', detail: 'Hospitalisation base in place' },
        { item: 'Young — low premiums', detail: 'Locks in cheap rates for life cover' },
      ],
      gaps: [
        { item: 'No critical illness cover', detail: 'A CI event would hit income and parent support', severity: 'high', gapValue: 'S$200k' },
        { item: 'Minimal life cover for dependent parent', detail: 'Mother is financially dependent', severity: 'medium', gapValue: 'S$250k' },
        { item: 'No wealth accumulation started', detail: 'Growth appetite unmatched by any plan', severity: 'medium', gapValue: 'Start now' },
      ],
      followUps: [
        { q: 'How much of your mother’s monthly expenses do you currently cover?', why: 'Sizes the life-cover amount needed to protect her.' },
        { q: 'Are you comfortable with market ups-and-downs for higher long-term growth?', why: 'Confirms suitability of an ILP vs a guaranteed plan.' },
        { q: 'Any family history of critical illness we should factor in?', why: 'Informs CI cover sizing and underwriting.' },
      ],
    },
    recommend: {
      confidence: 87,
      summary:
        'Lead with affordable critical-illness protection while young, add modest term cover for her dependent mother, then begin growth-oriented accumulation matched to her risk appetite.',
      shortlist: [
        {
          rank: 1,
          productId: 'PRD-PRUEARLY-CRISIS',
          needsFitScore: 93,
          confidence: 90,
          monthly: 55,
          coverageFor: 'S$200,000 multi-stage CI',
          whyItFits: [
            'Directly fills her #1 gap — no CI cover today',
            'Early-stage payout means support at diagnosis, not just late stage',
            'Cheapest to lock in at age 28',
          ],
          tradeoffs: ['Premiums increase at renewal milestones', 'Standalone — not life cover'],
          needsMatched: ['Critical illness', 'Early-stage payout'],
          sources: ['PRU/CI/PACC/2026', 'Needs analysis CL-1002'],
        },
        {
          rank: 2,
          productId: 'PRD-PRUACTIVE-TERM',
          needsFitScore: 84,
          confidence: 88,
          monthly: 24,
          coverageFor: 'S$250,000 term to age 60',
          whyItFits: [
            'Protects her dependent mother at very low cost',
            'Flexible term aligned to mother’s dependency period',
          ],
          tradeoffs: ['No cash value', 'Cover ends at term'],
          needsMatched: ['Income protection', 'Dependent care'],
          sources: ['PRU/TL/PAT/2026-v2'],
        },
        {
          rank: 3,
          productId: 'PRD-PRULINK-GROWTH',
          needsFitScore: 80,
          confidence: 79,
          monthly: 200,
          coverageFor: 'Market-linked growth portfolio',
          whyItFits: [
            'Matches her growth-oriented risk appetite and long horizon',
            'Flexible fund choice and top-ups as income grows',
          ],
          tradeoffs: ['No capital guarantee — value can fall', 'Fees reduce early-year returns'],
          needsMatched: ['Growth', 'Flexible'],
          sources: ['PRU/ILP/PLGG/2026', 'Risk profile CL-1002'],
        },
      ],
    },
  },

  'CL-1003': {
    discover: {
      confidence: 90,
      needsProfile: {
        protectionGoal: 'Retirement income + legacy / estate planning',
        horizon: 'Medium-long term',
        capacity: 'S$1,800/mo, balanced risk',
        topNeed: 'Retirement + legacy',
      },
      strengths: [
        { item: 'Strong existing protection', detail: 'Private Shield, WL, and CI rider already held' },
        { item: 'High CPF & income', detail: 'Strong capacity to fund retirement vehicles' },
      ],
      gaps: [
        { item: 'No structured retirement income', detail: 'Relies on CPF LIFE only for retirement payouts', severity: 'high', gapValue: 'S$3k/mo income' },
        { item: 'No legacy / estate vehicle', detail: 'Wants tax-efficient wealth transfer to 2 children', severity: 'medium', gapValue: 'Estate plan' },
        { item: 'CI cover may be underinsured', detail: 'S$100k CI vs his income level is light', severity: 'medium', gapValue: 'S$200k top-up' },
      ],
      followUps: [
        { q: 'What monthly income (in today’s dollars) would you like from age 65?', why: 'Sizes the retirement-income target precisely.' },
        { q: 'Do you intend to leave a specific legacy amount to each child?', why: 'Shapes the legacy vehicle and sum assured.' },
        { q: 'Are you open to a single-premium or short-pay option using existing savings?', why: 'Determines the most tax/cash-efficient funding route.' },
      ],
    },
    recommend: {
      confidence: 89,
      summary:
        'Anchor on a lifetime legacy-income vehicle for retirement and wealth transfer, complemented by a CI top-up. Whole-life accumulation considered but ranked below the income plan for his stated retirement goal.',
      shortlist: [
        {
          rank: 1,
          productId: 'PRD-PRUVANTAGE-LEGACY',
          needsFitScore: 94,
          confidence: 91,
          monthly: 1200,
          coverageFor: 'Lifetime income + 2-generation transfer',
          whyItFits: [
            'Delivers both his stated goals — retirement income and legacy — in one plan',
            'Change-of-life-assured passes wealth tax-efficiently to his children',
            'Guaranteed income floor suits his balanced risk appetite',
          ],
          tradeoffs: ['Income only after accumulation period', 'Heavy early-surrender penalty'],
          needsMatched: ['Retirement income', 'Legacy', 'Estate'],
          sources: ['PRU/LG/PVLI/2026-v1', 'Needs analysis CL-1003'],
        },
        {
          rank: 2,
          productId: 'PRD-PRUEARLY-CRISIS',
          needsFitScore: 82,
          confidence: 86,
          monthly: 140,
          coverageFor: 'S$200,000 CI top-up',
          whyItFits: [
            'Raises CI cover to match his income and lifestyle',
            'Multi-stage payouts protect against repeat events',
          ],
          tradeoffs: ['Premiums higher at his age', 'Underwriting may apply for top-up'],
          needsMatched: ['Critical illness'],
          sources: ['PRU/CI/PACC/2026'],
        },
        {
          rank: 3,
          productId: 'PRD-PRUWHOLE-LIFE',
          needsFitScore: 79,
          confidence: 83,
          monthly: 600,
          coverageFor: 'Lifelong cover + cash value',
          whyItFits: [
            'Builds a guaranteed cash-value asset alongside protection',
            'Useful estate-equalisation tool between children',
          ],
          tradeoffs: ['Lower income focus than rank 1', 'Bonuses non-guaranteed'],
          needsMatched: ['Lifelong cover', 'Estate', 'Cash value'],
          sources: ['PRU/WL/PWL/2026-v1'],
        },
      ],
    },
  },

  'CL-1004': {
    discover: {
      confidence: 91,
      needsProfile: {
        protectionGoal: 'Stable retirement income + healthcare in old age',
        horizon: 'Short-medium term',
        capacity: 'S$1,200/mo, conservative',
        topNeed: 'Retirement income + health',
      },
      strengths: [
        { item: 'Debt-free home', detail: 'No mortgage liability reduces protection need' },
        { item: 'Very strong CPF SA', detail: 'S$181k SA supports CPF LIFE retirement base' },
      ],
      gaps: [
        { item: 'Income gap at retirement', detail: 'Endowment matures 2027 but no recurring income plan', severity: 'high', gapValue: 'S$2k/mo income' },
        { item: 'Rising healthcare costs', detail: 'A-ward Shield may need rider for fuller cover', severity: 'medium', gapValue: 'Rider top-up' },
        { item: 'Idle maturing capital', detail: 'S$80k endowment maturing with no redeployment plan', severity: 'medium', gapValue: 'Reinvest S$80k' },
      ],
      followUps: [
        { q: 'When the S$80k endowment matures in 2027, would you prefer income or to keep it growing?', why: 'Decides whether to redeploy into an income or savings plan.' },
        { q: 'Do you want guaranteed payouts, even if returns are a little lower?', why: 'Confirms her conservative preference for guarantees.' },
        { q: 'Are you considering any private hospital upgrade as you age?', why: 'Determines if a Shield rider/upgrade is warranted.' },
      ],
    },
    recommend: {
      confidence: 88,
      summary:
        'Conservative, guarantee-led plan: redeploy maturing capital into a capital-guaranteed savings/income vehicle and consider a Shield rider, avoiding market-linked risk.',
      shortlist: [
        {
          rank: 1,
          productId: 'PRD-PRUACTIVE-SAVER',
          needsFitScore: 90,
          confidence: 89,
          monthly: 0,
          singlePremium: 'S$80,000 (single)',
          coverageFor: 'Capital-guaranteed reinvestment of maturing funds',
          whyItFits: [
            'Redeploys the 2027 endowment into a capital-guaranteed plan — matches her conservative profile',
            'Short premium term suits her pre-retirement horizon',
            'Provides a predictable lump sum / income to bridge to CPF LIFE',
          ],
          tradeoffs: ['Returns modest vs market plans', 'Low liquidity before maturity'],
          needsMatched: ['Savings', 'Capital guarantee', 'Retirement bridge'],
          sources: ['PRU/EN/PAS3/2026-v2', 'Needs analysis CL-1004'],
        },
        {
          rank: 2,
          productId: 'PRD-PRUVANTAGE-LEGACY',
          needsFitScore: 83,
          confidence: 84,
          monthly: 700,
          coverageFor: 'Guaranteed lifetime income',
          whyItFits: [
            'Adds a guaranteed monthly income stream for retirement',
            'Income floor aligns with her need for certainty',
          ],
          tradeoffs: ['Accumulation period delays payouts', 'Long commitment near retirement'],
          needsMatched: ['Retirement income'],
          sources: ['PRU/LG/PVLI/2026-v1'],
        },
        {
          rank: 3,
          productId: 'PRD-PRUSHIELD-PLUS',
          needsFitScore: 80,
          confidence: 86,
          monthly: 95,
          coverageFor: 'A-ward + rider upgrade',
          whyItFits: [
            'Reduces out-of-pocket costs as healthcare needs rise with age',
            'Rider lowers deductible and co-insurance',
          ],
          tradeoffs: ['Premiums climb steeply at older ages', 'Health declaration for upgrade'],
          needsMatched: ['Hospitalisation'],
          sources: ['PRU/IP/PSP/2026-v3'],
        },
      ],
    },
  },

  'CL-1005': {
    discover: {
      confidence: 86,
      needsProfile: {
        protectionGoal: 'Affordable first protection + savings habit',
        horizon: 'Long term',
        capacity: 'S$250/mo, growth-oriented',
        topNeed: 'Foundational cover + CI',
      },
      strengths: [
        { item: 'Very young', detail: 'Cheapest possible premiums; long compounding runway' },
        { item: 'No dependents / debt', detail: 'Can prioritise self-protection and growth' },
      ],
      gaps: [
        { item: 'No private hospital cover', detail: 'MediShield Life only — exposed to large bills', severity: 'high', gapValue: 'Ward A / Private' },
        { item: 'No critical illness cover', detail: 'CI cheapest to secure now while healthy', severity: 'high', gapValue: 'S$150k' },
        { item: 'No savings/accumulation started', detail: 'Missing early compounding years', severity: 'medium', gapValue: 'Start small' },
      ],
      followUps: [
        { q: 'What’s the most you can comfortably set aside monthly without straining cashflow?', why: 'Keeps the plan within his S$250 budget and sustainable.' },
        { q: 'Would you prefer guaranteed savings or higher-growth investing for the long run?', why: 'Chooses between endowment and ILP for accumulation.' },
        { q: 'Do you anticipate big changes (further study, overseas) in the next 3 years?', why: 'Affects how flexible/liquid the plan should be.' },
      ],
    },
    recommend: {
      confidence: 85,
      summary:
        'Build an affordable foundation first — hospitalisation and critical illness while young and cheap — then start a small growth-oriented accumulation, all within his S$250 budget.',
      shortlist: [
        {
          rank: 1,
          productId: 'PRD-PRUSHIELD-PLUS',
          needsFitScore: 92,
          confidence: 88,
          monthly: 45,
          coverageFor: 'A-ward Shield + basic rider',
          whyItFits: [
            'Closes his biggest exposure — no private hospital cover today',
            'Very low premium at his age',
            'Foundational cover everything else builds on',
          ],
          tradeoffs: ['Premiums rise with age', 'Deductible applies without higher rider'],
          needsMatched: ['Hospitalisation'],
          sources: ['PRU/IP/PSP/2026-v3', 'Needs analysis CL-1005'],
        },
        {
          rank: 2,
          productId: 'PRD-PRUEARLY-CRISIS',
          needsFitScore: 88,
          confidence: 85,
          monthly: 40,
          coverageFor: 'S$150,000 multi-stage CI',
          whyItFits: [
            'Locks in critical-illness cover at the cheapest lifetime rate',
            'Early-stage payouts protect his future earning power',
          ],
          tradeoffs: ['Adds to monthly outlay', 'Standalone CI, not life cover'],
          needsMatched: ['Critical illness', 'Early-stage payout'],
          sources: ['PRU/CI/PACC/2026'],
        },
        {
          rank: 3,
          productId: 'PRD-PRULINK-GROWTH',
          needsFitScore: 76,
          confidence: 77,
          monthly: 100,
          coverageFor: 'Small market-linked starter portfolio',
          whyItFits: [
            'Starts the savings habit with a long compounding runway',
            'Matches his growth appetite; can top up as income grows',
          ],
          tradeoffs: ['Pushes spend near budget ceiling', 'No capital guarantee'],
          needsMatched: ['Growth', 'Savings'],
          sources: ['PRU/ILP/PLGG/2026'],
        },
      ],
    },
  },
}

export const getAnalysis = (clientId) => analysisByClient[clientId]

// ─── Holistic needs analysis ────────────────────────────────────────────────
// A full financial-needs-analysis (FNA) view: every protection & wealth pillar
// is assessed for every client, not just the flagged gaps. The priority gaps
// above are drilled out of this complete picture.

export const pillars = [
  { key: 'life', label: 'Life / Income Replacement', icon: 'umbrella' },
  { key: 'tpd', label: 'Disability (TPD)', icon: 'user' },
  { key: 'ci', label: 'Critical Illness', icon: 'heart' },
  { key: 'medical', label: 'Hospitalisation & Medical', icon: 'shield' },
  { key: 'incomeProt', label: 'Disability Income', icon: 'bolt' },
  { key: 'retirement', label: 'Retirement Adequacy', icon: 'clock' },
  { key: 'savings', label: 'Savings & Wealth', icon: 'piggy' },
  { key: 'education', label: 'Children Education', icon: 'gem' },
  { key: 'legacy', label: 'Legacy & Estate', icon: 'tree' },
  { key: 'liquidity', label: 'Emergency / Debt Cover', icon: 'lock' },
]

// status: 'adequate' | 'partial' | 'gap' | 'na'
export const coverageMapByClient = {
  'CL-1001': {
    overallScore: 38,
    headline: 'Strong earner, dangerously thin protection — young family is exposed.',
    map: {
      life: { status: 'gap', note: 'Only S$120k group cover vs ~S$960k need; ends if he leaves job' },
      tpd: { status: 'gap', note: 'No personal TPD cover' },
      ci: { status: 'gap', note: 'No critical illness cover at all' },
      medical: { status: 'gap', note: 'MediShield Life only — no private/Ward A cover' },
      incomeProt: { status: 'gap', note: 'No disability-income protection' },
      retirement: { status: 'partial', note: 'CPF building, but no dedicated retirement plan' },
      savings: { status: 'partial', note: 'Healthy CPF; no earmarked cash savings' },
      education: { status: 'gap', note: '2 young children, no education fund started' },
      legacy: { status: 'na', note: 'Low priority at this life stage' },
      liquidity: { status: 'partial', note: 'S$420k mortgage; emergency buffer untested' },
    },
  },
  'CL-1002': {
    overallScore: 45,
    headline: 'Good medical base, but no CI safety net and wealth-building not started.',
    map: {
      life: { status: 'gap', note: 'Minimal cover; dependent mother unprotected' },
      tpd: { status: 'gap', note: 'No TPD cover' },
      ci: { status: 'gap', note: 'No critical illness cover — top priority' },
      medical: { status: 'partial', note: 'PRUShield Standard — restructured wards only' },
      incomeProt: { status: 'gap', note: 'No income protection' },
      retirement: { status: 'partial', note: 'Young; CPF only, ample runway' },
      savings: { status: 'gap', note: 'No accumulation started despite growth appetite' },
      education: { status: 'na', note: 'No children' },
      legacy: { status: 'na', note: 'Not applicable at this stage' },
      liquidity: { status: 'partial', note: 'Some PA cover; limited cash buffer' },
    },
  },
  'CL-1003': {
    overallScore: 58,
    headline: 'Well protected on health & life, but retirement income and legacy are unaddressed.',
    map: {
      life: { status: 'partial', note: 'S$250k WL light vs S$168k income' },
      tpd: { status: 'partial', note: 'Accelerated TPD only via legacy WL' },
      ci: { status: 'partial', note: 'S$100k CI underinsured for his profile' },
      medical: { status: 'adequate', note: 'Private PRUShield Premier in place' },
      incomeProt: { status: 'gap', note: 'No disability-income cover' },
      retirement: { status: 'gap', note: 'Relies on CPF LIFE only; no structured income' },
      savings: { status: 'partial', note: 'Strong CPF; no dedicated wealth vehicle' },
      education: { status: 'partial', note: '2 school-age children; no ring-fenced fund' },
      legacy: { status: 'gap', note: 'Wants estate planning — nothing in place' },
      liquidity: { status: 'adequate', note: 'High income & CPF buffer' },
    },
  },
  'CL-1004': {
    overallScore: 60,
    headline: 'Debt-free and asset-rich, but no plan to convert savings into retirement income.',
    map: {
      life: { status: 'adequate', note: 'Low need — debt-free, spouse working' },
      tpd: { status: 'partial', note: 'Limited standalone TPD cover' },
      ci: { status: 'gap', note: 'No critical illness cover' },
      medical: { status: 'partial', note: 'A-ward Shield; rider may be needed with age' },
      incomeProt: { status: 'partial', note: 'Near retirement — relevance declining' },
      retirement: { status: 'gap', note: 'No recurring retirement-income plan' },
      savings: { status: 'partial', note: 'S$80k endowment maturing 2027, no redeploy plan' },
      education: { status: 'na', note: 'No dependent children' },
      legacy: { status: 'partial', note: 'Basic estate intent, not structured' },
      liquidity: { status: 'adequate', note: 'Fully paid home, strong CPF SA' },
    },
  },
  'CL-1005': {
    overallScore: 40,
    headline: 'Clean slate — cheapest time to lock in foundations and start compounding.',
    map: {
      life: { status: 'na', note: 'No dependents yet' },
      tpd: { status: 'gap', note: 'No TPD cover' },
      ci: { status: 'gap', note: 'No CI — cheapest to secure now' },
      medical: { status: 'gap', note: 'MediShield Life only' },
      incomeProt: { status: 'gap', note: 'No income protection' },
      retirement: { status: 'partial', note: 'Very young; long compounding runway' },
      savings: { status: 'gap', note: 'No savings or investing started' },
      education: { status: 'na', note: 'No children' },
      legacy: { status: 'na', note: 'Not applicable' },
      liquidity: { status: 'partial', note: 'Low CPF balance; thin emergency buffer' },
    },
  },
}

export const getCoverageMap = (clientId) => coverageMapByClient[clientId]

export const statusMeta = {
  adequate: { label: 'Adequate', tone: 'good' },
  partial: { label: 'Underinsured', tone: 'warn' },
  gap: { label: 'Gap', tone: 'bad' },
  na: { label: 'N/A', tone: 'slate' },
}
