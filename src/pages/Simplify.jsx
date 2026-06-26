import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import AgentRunner from '../components/AgentRunner.jsx'
import { Badge, ConfidenceMeter, SectionTitle, SeverityTag, SourceChip } from '../components/ui.jsx'
import { policies, getPolicy } from '../data/policies.js'
import { skills, simplifySteps } from '../data/agents.js'
import SkillCard from '../components/SkillCard.jsx'

export default function Simplify() {
  const loc = useLocation()
  const [selected, setSelected] = useState(loc.state?.policyId || null)
  const [phase, setPhase] = useState('select') // select | running | result
  const policy = getPolicy(selected)

  // Scroll back to the top when the agent starts running / shows results.
  useEffect(() => {
    if (phase !== 'select') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  const start = () => setPhase('running')
  const reset = () => {
    setPhase('select')
    setSelected(null)
  }

  const header = (
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <Badge tone="red" icon="simplify">Simplify Agent · Policy Explainer</Badge>
        <h1 className="mt-2 text-2xl font-extrabold text-pru-ink">Plain-English policy breakdown</h1>
        <p className="text-pru-slate mt-1 max-w-2xl">
          Select a valid Prudential policy, start the analysis, and the agent reads the document via MCP and returns
          an honest summary — coverage, exclusions and jargon explained.
        </p>
      </div>
      {phase !== 'select' && (
        <button onClick={reset} className="btn-ghost">
          <Icon name="arrow" className="w-4 h-4 rotate-180" /> New analysis
        </button>
      )}
    </div>
  )

  if (phase === 'result') {
    return (
      <div className="space-y-6">
        {header}
        <FlowSteps phase={phase} />
        <Result policy={policy} />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-5 items-start">
      <div className="lg:col-span-2 space-y-6">
        {header}
        <FlowSteps phase={phase} />

        {phase === 'select' ? (
          <div>
            <SectionTitle
              kicker="Step 1"
              title="Select a policy to analyse"
              icon="doc"
              right={
                <button disabled={!selected} onClick={start} className="btn-primary">
                  <Icon name="bolt" className="w-4 h-4" /> Start analysis
                </button>
              }
            />
            <div className="grid sm:grid-cols-2 gap-3">
              {policies.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`card p-4 text-left transition-all hover:-translate-y-0.5 ${
                    selected === p.id ? 'ring-2 ring-pru-red border-pru-red' : 'hover:shadow-pop'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge tone="slate">{p.category}</Badge>
                    {selected === p.id && <Icon name="check" className="w-5 h-5 text-pru-red" strokeWidth={3} />}
                  </div>
                  <h3 className="mt-2 font-extrabold text-pru-ink">{p.name}</h3>
                  <p className="text-xs text-pru-slate mt-0.5">{p.tagline}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-pru-slate font-mono">
                    <span>{p.docRef}</span>
                    <span>{p.pages} pp · {p.premiumFrom}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <SectionTitle kicker="Step 2" title={`Agent reading "${policy.name}"`} icon="cpu" />
            <AgentRunner steps={simplifySteps(policy.name, policy.id)} onDone={() => setPhase('result')} />
          </div>
        )}
      </div>

      <SkillCard skill={skills.simplify} accentTitle="simplify.SKILLS.md" live={phase === 'running'} />
    </div>
  )
}

function FlowSteps({ phase }) {
  const steps = ['Select policy', 'Agent analysis', 'Simplified summary']
  const idx = phase === 'select' ? 0 : phase === 'running' ? 1 : 2
  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold ${
              i <= idx ? 'bg-pru-red text-white' : 'bg-white text-pru-slate border border-pru-line'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i <= idx ? 'bg-white/25' : 'bg-pru-mist'}`}>
              {i < idx ? <Icon name="check" className="w-3 h-3" strokeWidth={3} /> : i + 1}
            </span>
            {s}
          </span>
          {i < steps.length - 1 && <Icon name="arrow" className="w-4 h-4 text-pru-line" />}
        </div>
      ))}
    </div>
  )
}

function Result({ policy }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge tone="good" icon="check">Summary ready</Badge>
          <h2 className="mt-2 text-xl font-extrabold text-pru-ink">{policy.name}</h2>
          <p className="text-sm text-pru-slate">{policy.tagline}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <SourceChip>{policy.docRef}</SourceChip>
            <SourceChip>{policy.pages} pages · updated {policy.lastUpdated}</SourceChip>
          </div>
        </div>
        <ConfidenceMeter score={policy.confidence} size={76} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Panel title="What's covered" icon="check" tone="good" items={policy.covered} />
        <Panel title="What's not covered" icon="x" tone="warn" items={policy.notCovered} />
      </div>

      {/* Exclusions */}
      <div className="card p-5">
        <SectionTitle kicker="Flagged honestly" title="Exclusions — read these" icon="alert" />
        <div className="grid sm:grid-cols-2 gap-3">
          {policy.exclusions.map((e, i) => (
            <div key={i} className="rounded-xl border border-pru-line p-3.5 flex gap-3">
              <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                e.severity === 'high' ? 'bg-bad-soft text-bad' : e.severity === 'medium' ? 'bg-warn-soft text-warn' : 'bg-pru-mist text-pru-slate'
              }`}>
                <Icon name="alert" className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-pru-ink text-sm">{e.item}</span>
                  <SeverityTag severity={e.severity} />
                </div>
                <p className="text-xs text-pru-slate mt-0.5">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key terms + raw */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <SectionTitle kicker="Jargon, explained" title="Key terms" icon="doc" />
          <dl className="space-y-3">
            {policy.keyTerms.map((t, i) => (
              <div key={i} className="flex gap-3">
                <dt className="w-32 shrink-0 font-bold text-pru-ink text-sm">{t.term}</dt>
                <dd className="text-sm text-pru-slate">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="card p-5">
          <SectionTitle kicker="Source clause" title="Original policy language" icon="lock" />
          <div className="rounded-xl bg-pru-mist border border-pru-line p-4 text-[13px] text-pru-slate leading-relaxed font-mono max-h-56 overflow-y-auto">
            “{policy.raw}”
          </div>
          <p className="mt-2 text-[11px] text-pru-slate">The agent simplified this clause above — original kept for transparency.</p>
        </div>
      </div>
    </div>
  )
}

function Panel({ title, icon, tone, items }) {
  const head = { good: 'text-good', warn: 'text-warn' }[tone]
  return (
    <div className="card p-5">
      <h3 className={`flex items-center gap-2 font-extrabold ${head} mb-3`}>
        <Icon name={icon} className="w-5 h-5" strokeWidth={2.4} /> {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <Icon name={icon} className={`w-4 h-4 mt-0.5 shrink-0 ${head}`} strokeWidth={2.6} />
            <div>
              <div className="text-sm font-semibold text-pru-ink">{it.item}</div>
              <div className="text-xs text-pru-slate">{it.detail}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
