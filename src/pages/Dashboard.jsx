import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Badge, SectionTitle, Stat } from '../components/ui.jsx'
import { clients } from '../data/clients.js'
import { policies } from '../data/policies.js'
import { auditTrail } from '../data/governance.js'

const agents = [
  {
    to: '/simplify',
    icon: 'simplify',
    kicker: 'Policy Explainer',
    title: 'Simplify Agent',
    desc: 'Turns a dense policy into plain English: what’s covered, what’s not, every exclusion flagged.',
    cta: 'Explain a policy',
  },
  {
    to: '/discover',
    icon: 'discover',
    kicker: 'Needs Profiler',
    title: 'Discover Agent',
    desc: 'Pulls verified Singpass data, maps coverage gaps, and drafts the questions to ask next.',
    cta: 'Profile a client',
  },
  {
    to: '/recommend',
    icon: 'recommend',
    kicker: 'Decision Aid',
    title: 'Recommend Agent',
    desc: 'Builds a ranked, side-by-side shortlist with reasons and tradeoffs, for you to approve.',
    cta: 'Build a shortlist',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()

  // KPIs are counted off the audit trail, so the numbers on the dashboard are
  // the same events the governance page lists.
  const agentRuns = auditTrail.filter((a) => a.actor === 'AI Agent').length

  return (
    <div className="pt-2 space-y-7">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-lg bg-pru-ink text-white p-7">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-pru-red/25 blur-3xl" />
        <div className="absolute right-24 bottom-0 w-48 h-48 rounded-full bg-pru-red/10 blur-2xl" />
        <div className="relative">
          <Badge tone="red" icon="spark">3-Engine Agentic Architecture</Badge>
          <h1 className="mt-3 text-[26px] font-extrabold tracking-tight">
            Cut client prep from <span className="text-pru-red">hours to minutes</span> without giving up control.
          </h1>
          <p className="mt-2 text-[13px] text-white/60 max-w-2xl">
            PRU.NAVIGATOR prepares and shortlists. The MAS-licensed consultant review, adjust and approve.<br></br>
            Every step is sourced, confidence-scored and audit-trailed.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => navigate('/simplify')} className="btn-primary">
              <Icon name="bolt" className="w-4 h-4" /> Start a flow
            </button>
            <Link to="/audit" className="btn bg-white/10 text-white hover:bg-white/15">
              <Icon name="lock" className="w-4 h-4" /> View FEAT governance
            </Link>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat value={clients.length} label="Active clients" icon="user" tone="ink" />
        <Stat value={policies.length} label="Valid Prudential policies" icon="doc" tone="red" />
        <Stat value={agentRuns} label="Agent analyses run" icon="cpu" tone="good" />
        <Stat value="100%" label="Consultant-approved" icon="lock" tone="warn" />
      </div>

      {/* Agent entry cards */}
      <div>
        <SectionTitle title="Pick an agent to start" icon="cpu" />
        <div className="grid md:grid-cols-3 gap-4">
          {agents.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="card p-5 group hover:shadow-pop hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-md bg-bad-soft text-pru-red flex items-center justify-center shrink-0 group-hover:bg-pru-red group-hover:text-white transition-colors">
                  <Icon name={a.icon} className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="label-kicker">{a.kicker}</div>
                  <h3 className="text-lg font-extrabold text-pru-ink">{a.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-pru-slate leading-relaxed">{a.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-pru-red">
                {a.cta} <Icon name="arrow" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Recent clients */}
        <div className="lg:col-span-3 card p-5">
          <SectionTitle
            kicker="Discover Agent"
            title="Recent clients"
            icon="discover"
            right={<Link to="/discover" className="text-sm font-bold text-pru-red flex items-center gap-1">Open <Icon name="arrow" className="w-4 h-4" /></Link>}
          />
          <div className="divide-y divide-pru-line">
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate('/discover', { state: { clientId: c.id } })}
                className="w-full flex items-center gap-3 py-3 text-left hover:bg-pru-mist rounded px-2 -mx-2 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full ${c.avatarTone} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                  {c.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-pru-ink text-sm">{c.name}</div>
                  <div className="text-xs text-pru-slate">{c.age} · {c.lifeStage} · {c.occupation}</div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-xs text-pru-slate">{c.nric}</div>
                  <Badge tone="good" icon="check">{c.status}</Badge>
                </div>
                <Icon name="arrow" className="w-4 h-4 text-pru-slate shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Valid policies */}
        <div className="lg:col-span-2 card p-5">
          <SectionTitle
            kicker="Simplify Agent"
            title="Valid policies"
            icon="simplify"
            right={<Link to="/simplify" className="text-sm font-bold text-pru-red flex items-center gap-1">Open <Icon name="arrow" className="w-4 h-4" /></Link>}
          />
          <div className="space-y-2">
            {policies.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate('/simplify', { state: { policyId: p.id } })}
                className="w-full text-left p-3 rounded-md border border-pru-line hover:border-pru-red hover:bg-bad-soft/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-pru-ink text-sm">{p.name}</div>
                  <Badge tone="slate">{p.category}</Badge>
                </div>
                <div className="text-xs text-pru-slate mt-0.5 font-mono">{p.docRef}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <SectionTitle
          kicker="Governance"
          title="Recent agent activity"
          icon="audit"
          right={<Link to="/audit" className="text-sm font-bold text-pru-red flex items-center gap-1">Full trail <Icon name="arrow" className="w-4 h-4" /></Link>}
        />
        <div className="space-y-2">
          {auditTrail.slice(0, 4).map((a) => (
            <div key={a.id} className="flex items-center gap-3 text-sm py-2 border-b border-pru-line last:border-0">
              <Badge tone={a.actor === 'AI Agent' ? 'info' : 'dark'}>{a.agent}</Badge>
              <span className="flex-1 text-pru-ink font-medium truncate">{a.action}</span>
              <span className="hidden md:inline text-pru-slate text-xs">{a.client}</span>
              <span className="text-pru-slate text-xs font-mono">{a.time.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
