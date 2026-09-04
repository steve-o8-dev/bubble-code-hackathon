// Hardcoded Prudential policy documents for the Simplify (Policy Explainer) Agent.
// `raw` mimics dense policy-document language; `simplified` is the agent output.

export const policies = [
  {
    id: 'POL-PRUSHIELD-PLUS',
    name: 'PRUShield Plus',
    category: 'Health Protection',
    type: 'Integrated Shield Plan',
    docRef: 'PRU/IP/PSP/2026-v3',
    pages: 48,
    lastUpdated: '2026-01-15',
    premiumFrom: 'S$620 / year',
    tagline: 'Private hospital & Ward A coverage on top of MediShield Life',
    raw:
      'The Company shall indemnify the Life Assured in respect of eligible hospitalisation and surgical expenses incurred at a Restructured Hospital or Private Medical Institution, subject to the prevailing MediShield Life claim limits, the applicable deductible of S$3,500 per policy year and a co-insurance of 10% of the eligible balance, save where a PRUExtra rider is concurrently in force...',
    confidence: 96,
    covered: [
      { item: 'Private & restructured hospital stays', detail: 'Ward up to private hospital, as-charged within annual limit of S$1,500,000' },
      { item: 'Pre- & post-hospitalisation', detail: '90 days before and 100 days after admission' },
      { item: 'Day surgery & A&E', detail: 'Inclusive of stipulated outpatient surgical procedures' },
      { item: 'Cancer drug treatment', detail: 'On the approved Cancer Drug List (CDL), at MOH-stipulated limits' },
    ],
    notCovered: [
      { item: 'Outpatient GP / specialist (non-surgical)', detail: 'Routine consultations not tied to hospitalisation' },
      { item: 'Dental (non-accident)', detail: 'Cosmetic and routine dental excluded' },
    ],
    exclusions: [
      { item: 'Pre-existing conditions', detail: 'Conditions present before cover start, unless declared & accepted', severity: 'high' },
      { item: 'Deductible S$3,500 + 10% co-insurance', detail: 'You pay this before the plan pays; rider needed to reduce', severity: 'high' },
      { item: 'Cosmetic / elective procedures', detail: 'Non-medically-necessary treatment is not payable', severity: 'medium' },
      { item: 'Self-inflicted injury & unlawful acts', detail: 'Standard policy exclusion', severity: 'medium' },
    ],
    keyTerms: [
      { term: 'Deductible', meaning: 'The first S$3,500 of the bill each year that you pay yourself.' },
      { term: 'Co-insurance', meaning: 'Your 10% share of the bill after the deductible.' },
      { term: 'As-charged', meaning: 'Pays the actual hospital bill up to the annual limit.' },
    ],
  },
  {
    id: 'POL-PRUACTIVE-TERM',
    name: 'PRUActive Term',
    category: 'Life Protection',
    type: 'Term Life Insurance',
    docRef: 'PRU/TL/PAT/2026-v2',
    pages: 32,
    lastUpdated: '2025-11-30',
    premiumFrom: 'S$38 / month',
    tagline: 'Affordable, high-coverage income protection for a fixed term',
    raw:
      'Upon the death or Total and Permanent Disability of the Life Assured during the Term, provided all premiums due have been paid, the Company shall pay the Sum Assured then in force, less any indebtedness, whereupon the Policy shall terminate; no surrender or maturity value being payable at the expiry of the Term...',
    confidence: 94,
    covered: [
      { item: 'Death benefit', detail: 'Full sum assured (up to S$2,000,000) paid to nominees' },
      { item: 'Total & Permanent Disability (TPD)', detail: 'Accelerated payout before age 70' },
      { item: 'Terminal illness', detail: 'Early payout of sum assured on diagnosis' },
      { item: 'Renewable & convertible', detail: 'Convert to a whole-life plan without fresh underwriting' },
    ],
    notCovered: [
      { item: 'Maturity / cash value', detail: 'Pure protection — no payout if you outlive the term', severity: 'medium' },
      { item: 'Critical illness', detail: 'Requires an added Crisis Cover rider' },
    ],
    exclusions: [
      { item: 'Suicide within first 12 months', detail: 'No death benefit; premiums refunded', severity: 'high' },
      { item: 'Pre-existing TPD conditions', detail: 'Disability from undeclared conditions excluded', severity: 'high' },
      { item: 'Hazardous activities', detail: 'Unless declared & loaded (e.g. professional diving)', severity: 'medium' },
    ],
    keyTerms: [
      { term: 'Sum Assured', meaning: 'The fixed amount paid out on a valid claim.' },
      { term: 'Accelerated benefit', meaning: 'TPD/terminal illness payout reduces the death benefit.' },
      { term: 'Convertible', meaning: 'Switch to permanent cover later without new health checks.' },
    ],
  },
  {
    id: 'POL-PRUWHOLE-LIFE',
    name: 'PRUWhole Life',
    category: 'Life Protection',
    type: 'Participating Whole Life',
    docRef: 'PRU/WL/PWL/2026-v1',
    pages: 56,
    lastUpdated: '2026-02-20',
    premiumFrom: 'S$180 / month',
    tagline: 'Lifelong protection with a growing cash value',
    raw:
      'This participating policy provides a Guaranteed Sum Assured together with non-guaranteed reversionary bonuses which, once declared, are vested and form part of the Death Benefit; the Surrender Value comprising the guaranteed cash value and the cash value of vested bonuses being subject to the Company’s prevailing bonus rates which are not guaranteed...',
    confidence: 91,
    covered: [
      { item: 'Lifelong death benefit', detail: 'Guaranteed sum assured + accumulated bonuses' },
      { item: 'Multiplier protection', detail: 'Up to 5x cover until age 70 for the same premium' },
      { item: 'Cash value growth', detail: 'Guaranteed cash value plus non-guaranteed bonuses' },
      { item: 'TPD & terminal illness', detail: 'Accelerated benefit included' },
    ],
    notCovered: [
      { item: 'Guaranteed bonus rates', detail: 'Bonuses are non-guaranteed and depend on fund performance', severity: 'high' },
      { item: 'Full value on early surrender', detail: 'Surrender in early years returns less than premiums paid', severity: 'high' },
    ],
    exclusions: [
      { item: 'Suicide within first 12 months', detail: 'Standard exclusion; premiums refunded', severity: 'high' },
      { item: 'Non-guaranteed bonus reduction', detail: 'Projected values may not materialise', severity: 'medium' },
    ],
    keyTerms: [
      { term: 'Participating policy', meaning: 'You share in the insurer’s par-fund profits via bonuses.' },
      { term: 'Reversionary bonus', meaning: 'Yearly bonus added to your cover, once declared it is locked in.' },
      { term: 'Multiplier', meaning: 'Boosts your cover (e.g. 5x) during your working years.' },
    ],
  },
  {
    id: 'POL-PRUACTIVE-SAVER',
    name: 'PRUActive Saver III',
    category: 'Wealth Accumulation',
    type: 'Endowment Savings',
    docRef: 'PRU/EN/PAS3/2026-v2',
    pages: 40,
    lastUpdated: '2025-12-05',
    premiumFrom: 'S$300 / month',
    tagline: 'Short-commitment savings plan with capital guarantee at maturity',
    raw:
      'Premiums are payable for the Premium Term elected; upon maturity the Company shall pay the Guaranteed Maturity Value together with any accumulated non-guaranteed bonuses; in the event of early termination prior to maturity, the Surrender Value payable may be less than the total premiums paid...',
    confidence: 93,
    covered: [
      { item: 'Guaranteed maturity value', detail: 'Capital guaranteed at end of policy term' },
      { item: 'Potential upside bonuses', detail: 'Non-guaranteed bonuses on top of guaranteed value' },
      { item: 'Short premium term', detail: 'Pay for 5 years, cover continues to maturity' },
      { item: 'Death benefit', detail: '101% of premiums or surrender value, whichever higher' },
    ],
    notCovered: [
      { item: 'High protection cover', detail: 'A savings plan — not a substitute for life insurance', severity: 'medium' },
      { item: 'Liquidity in early years', detail: 'Early surrender returns less than paid in', severity: 'high' },
    ],
    exclusions: [
      { item: 'Capital guarantee only at maturity', detail: 'Guarantee does not apply on early surrender', severity: 'high' },
      { item: 'Non-guaranteed returns', detail: 'Illustrated 4.25% p.a. is not guaranteed', severity: 'medium' },
    ],
    keyTerms: [
      { term: 'Maturity value', meaning: 'What you receive when the plan ends as planned.' },
      { term: 'Capital guaranteed', meaning: 'You get at least your premiums back at maturity.' },
      { term: 'Surrender value', meaning: 'Cash-out amount if you exit early — can be lower.' },
    ],
  },
  {
    id: 'POL-PRUVANTAGE-LEGACY',
    name: 'PRUVantage Legacy Income',
    category: 'Legacy Planning',
    type: 'Whole Life Income / Legacy',
    docRef: 'PRU/LG/PVLI/2026-v1',
    pages: 52,
    lastUpdated: '2026-03-01',
    premiumFrom: 'S$500 / month',
    tagline: 'Multi-generational income stream and wealth transfer',
    raw:
      'The Policy provides a monthly Guaranteed Income from the end of the Accumulation Period, alongside a Death Benefit payable to the nominated beneficiaries; the Policy permits a Change of Life Assured option enabling the continuation of benefits across generations subject to the Company’s administrative rules then prevailing...',
    confidence: 89,
    covered: [
      { item: 'Lifetime guaranteed income', detail: 'Monthly payout after the accumulation period' },
      { item: 'Wealth transfer', detail: 'Change-of-life-assured passes the plan to the next generation' },
      { item: 'Death benefit to beneficiaries', detail: 'Lump sum on top of income stream' },
      { item: 'Legacy multiplier', detail: 'Enhanced payout for estate-planning needs' },
    ],
    notCovered: [
      { item: 'Short-term liquidity', detail: 'Designed as a long-horizon legacy vehicle', severity: 'medium' },
      { item: 'Health / hospitalisation', detail: 'Not a medical plan', severity: 'low' },
    ],
    exclusions: [
      { item: 'Income only after accumulation period', detail: 'No payouts during the initial accumulation years', severity: 'medium' },
      { item: 'Non-guaranteed bonus component', detail: 'Part of the income is non-guaranteed', severity: 'medium' },
      { item: 'Early surrender penalty', detail: 'Significant loss if surrendered early', severity: 'high' },
    ],
    keyTerms: [
      { term: 'Accumulation period', meaning: 'The waiting years before income payouts begin.' },
      { term: 'Change of life assured', meaning: 'Transfer the policy to a child/grandchild to extend it.' },
      { term: 'Guaranteed income', meaning: 'The fixed monthly amount you can rely on.' },
    ],
  },
]

export const getPolicy = (id) => policies.find((p) => p.id === id)

// ─── Uploaded documents ─────────────────────────────────────────────────────
// The consultant can drop in their own policy PDF instead of picking from the
// catalogue above. There is no parser here (presentation only), so the agent
// output is resolved two ways:
//   1. the filename is matched against the known catalogue — upload
//      "PRUShield-Plus.pdf" and you get that policy's real breakdown;
//   2. anything unrecognised falls back to `genericUploadAnalysis` below, at a
//      deliberately lower confidence so the "flag for human review" rule in
//      simplify.SKILLS.md visibly kicks in.

// Keywords are matched against the lower-cased filename, most specific first.
const filenameHints = [
  { id: 'POL-PRUSHIELD-PLUS', keywords: ['prushield', 'shield', 'integrated', 'medisave', 'medishield'] },
  { id: 'POL-PRUACTIVE-TERM', keywords: ['pruactive term', 'active term', 'term'] },
  { id: 'POL-PRUWHOLE-LIFE', keywords: ['whole life', 'wholelife', 'whole-life'] },
  { id: 'POL-PRUACTIVE-SAVER', keywords: ['saver', 'endowment', 'savings'] },
  { id: 'POL-PRUVANTAGE-LEGACY', keywords: ['legacy', 'vantage', 'income'] },
]

export const matchPolicyByFilename = (filename = '') => {
  const f = filename.toLowerCase()
  const hit = filenameHints.find((h) => h.keywords.some((k) => f.includes(k)))
  return hit ? getPolicy(hit.id) : null
}

// Fallback breakdown for a document the agent doesn't recognise.
export const genericUploadAnalysis = {
  category: 'Uploaded Document',
  type: 'Insurance policy document',
  tagline: 'Plain-English breakdown of your uploaded policy document',
  premiumFrom: 'See schedule',
  confidence: 84,
  raw:
    'Subject to the terms, conditions and exclusions of this Policy, the Company shall pay the benefits specified in the Policy Schedule upon the occurrence of an insured event during the Period of Insurance, provided that all premiums due have been paid and any applicable waiting period has elapsed; no benefit shall be payable in respect of any condition arising directly or indirectly from a Pre-existing Condition unless expressly declared and accepted in writing...',
  covered: [
    { item: 'Benefits listed in the Policy Schedule', detail: 'Payable on an insured event within the period of insurance' },
    { item: 'Cover during the stated policy term', detail: 'Subject to premiums being paid up to date' },
    { item: 'Standard claim process', detail: 'Documented notification and assessment procedure applies' },
  ],
  notCovered: [
    { item: 'Anything outside the Policy Schedule', detail: 'Benefits not expressly listed are not payable' },
    { item: 'Claims during the waiting period', detail: 'Events occurring before the waiting period ends' },
  ],
  exclusions: [
    { item: 'Pre-existing conditions', detail: 'Excluded unless declared and accepted in writing before cover starts', severity: 'high' },
    { item: 'Waiting period before benefits start', detail: 'Confirm the exact duration in the Policy Schedule', severity: 'medium' },
    { item: 'Lapse on non-payment of premium', detail: 'Cover ceases if premiums are not paid within the grace period', severity: 'medium' },
  ],
  keyTerms: [
    { term: 'Policy Schedule', meaning: 'The page listing exactly what you are covered for and for how much.' },
    { term: 'Period of Insurance', meaning: 'The dates between which the cover actually applies.' },
    { term: 'Waiting period', meaning: 'Time after the start date before you can claim.' },
    { term: 'Pre-existing condition', meaning: 'Something you already had before the cover began.' },
  ],
}

const fileSize = (bytes) => {
  if (!bytes && bytes !== 0) return ''
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Builds a policy-shaped record from an uploaded file so the result view can
// render it exactly like a catalogue policy.
export const buildUploadedPolicy = (file) => {
  const matched = matchPolicyByFilename(file.name)
  const base = matched || genericUploadAnalysis
  return {
    ...base,
    id: 'POL-UPLOAD',
    uploaded: true,
    matchedId: matched ? matched.id : null,
    recognisedAs: matched ? matched.name : null,
    name: file.name.replace(/\.pdf$/i, ''),
    docRef: file.name,
    pages: null,
    metaLabel: `Uploaded · ${fileSize(file.size)} · just now`,
  }
}

// Rebuilds a full policy record from a stored history entry. Uploaded File
// objects can't be persisted, so history keeps only the resolved identity
// (which catalogue policy it matched, if any) and we reconstruct from that.
export const policyFromHistory = (entry) => {
  if (entry.source === 'catalogue') return getPolicy(entry.policyId)
  const matched = entry.matchedId ? getPolicy(entry.matchedId) : null
  return {
    ...(matched || genericUploadAnalysis),
    id: 'POL-UPLOAD',
    uploaded: true,
    matchedId: entry.matchedId || null,
    recognisedAs: matched ? matched.name : null,
    name: entry.name,
    docRef: entry.docRef,
    pages: null,
    metaLabel: entry.metaLabel,
  }
}
