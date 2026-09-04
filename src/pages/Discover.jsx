import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import LoadingOverlay from '../components/LoadingOverlay.jsx'
import SkillCard from '../components/SkillCard.jsx'
import { Badge, ConfidenceMeter, SectionTitle, SeverityTag, SourceChip } from '../components/ui.jsx'
import { clients, getClient } from '../data/clients.js'
import { getAnalysis, getCoverageMap, pillars, statusMeta } from '../data/analysis.js'
import { skills } from '../data/agents.js'

const sgd = (n) => 'S$' + n.toLocaleString('en-SG')

export default function Discover() {
  const loc = useLocation()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(loc.state?.clientId || null)
  const [phase, setPhase] = useState('select')
  const client = getClient(selected)
  const analysis = client ? getAnalysis(client.id)?.discover : null

  // Scroll back to the top when the agent starts running / shows results.
  useEffect(() => {
    if (phase !== 'select') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  const reset = () => {
    setPhase('select')
    setSelected(null)
  }

  const header = (
    <div>
      <Badge tone="red" icon="discover">Discover Agent · Needs Profiler</Badge>
      <div className="mt-1 flex items-center gap-2 flex-wrap">
        <h1 className="text-[22px] font-extrabold text-pru-ink">Coverage gaps & follow-up questions</h1>
        <SkillCard skill={skills.discover} accentTitle="discover.SKILLS.md" live={phase === 'running'} />
      </div>
      <p className="text-sm text-pru-slate mt-1 max-w-4xl">
        Client data is auto-pulled via Singpass MCP — the agent maps coverage gaps and drafts your follow-up questions.
      </p>
    </div>
  )

  const stepsRow = () => (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <FlowSteps phase={phase} />
      {phase !== 'select' && (
        <button onClick={reset} className="btn-primary">
          <Icon name="arrow" className="w-4 h-4 rotate-180" /> New analysis
        </button>
      )}
    </div>
  )

  if (phase === 'result') {
    return (
      <div className="space-y-6">
        {header}
        {stepsRow()}
        <Result client={client} analysis={analysis} onRecommend={() => navigate('/recommend', { state: { clientId: client.id } })} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {header}
      {stepsRow()}

      <div className="card p-5">
        <SectionTitle
          kicker="Step 1"
          title="Select a client"
          icon="user"
          right={
            <button disabled={!selected} onClick={() => setPhase('running')} className="btn-primary">
              <Icon name="bolt" className="w-4 h-4" /> Start analysis
            </button>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`card p-4 text-left flex flex-col transition-all hover:-translate-y-0.5 ${
                selected === c.id ? 'ring-2 ring-pru-red border-pru-red' : 'hover:shadow-pop'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`w-11 h-11 rounded-full ${c.avatarTone} text-white flex items-center justify-center font-bold shrink-0`}>
                  {c.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <span className="text-[11px] font-mono text-pru-slate">{c.nric}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="font-extrabold text-pru-ink truncate">{c.name}</span>
                {selected === c.id && <Icon name="check" className="w-4 h-4 text-pru-red shrink-0" strokeWidth={3} />}
              </div>
              <div className="text-xs text-pru-slate">{c.age} · {c.lifeStage}</div>
              <div className="text-xs text-pru-slate truncate">{c.occupation}</div>
              <div className="mt-3 pt-3 border-t border-pru-line text-xs text-pru-slate">
                {sgd(c.singpass.annualIncome)}/yr · {c.singpass.dependents} dep.
              </div>
            </button>
          ))}
        </div>
      </div>

      {phase === 'running' && (
        <LoadingOverlay
          label="Discover Agent"
          sublabel={`Profiling ${client.name}…`}
          onDone={() => setPhase('result')}
        />
      )}
    </div>
  )
}

function FlowSteps({ phase }) {
  const steps = ['Select client', 'Agent analysis', 'Gaps & questions']
  const idx = phase === 'select' ? 0 : phase === 'running' ? 1 : 2
  return (
    <div className="flex items-center text-sm">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-semibold ${i <= idx ? 'bg-pru-red text-white' : 'bg-white text-pru-slate border border-pru-line'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i <= idx ? 'bg-white/25' : 'bg-pru-mist'}`}>
              {i < idx ? <Icon name="check" className="w-3 h-3" strokeWidth={3} /> : i + 1}
            </span>
            {s}
          </span>
          {i < steps.length - 1 && (
            <span className="h-px w-8 shrink-0 bg-pru-ink" />
          )}
        </div>
      ))}
    </div>
  )
}

function Result({ client, analysis, onRecommend }) {
  return (
    <div className="space-y-5 animate-fade-up">
      {/* Singpass auto-filled profile */}
      <div className="card p-5">
        <SectionTitle
          kicker="Pulled via MCP"
          title="Singpass-verified profile"
          icon="lock"
          right={<SourceChip>source: Singpass Myinfo · {client.nric}</SourceChip>}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Annual income" value={sgd(client.singpass.annualIncome)} />
          <Field label="CPF (OA / SA)" value={`${sgd(client.singpass.cpfOA)} / ${sgd(client.singpass.cpfSA)}`} />
          <Field label="Dependents" value={client.singpass.dependents} />
          <Field label="Housing" value={client.singpass.housing} />
          <Field label="Life stage" value={client.lifeStage} />
          <Field label="Risk appetite" value={client.riskAppetite} />
          <Field label="Monthly budget" value={sgd(client.monthlyBudget)} />
          <Field label="Occupation" value={client.occupation} />
        </div>
      </div>

      {/* Needs profile + confidence */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-5">
          <SectionTitle kicker="Output" title="Client needs profile" icon="discover" />
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(analysis.needsProfile).map(([k, v]) => (
              <div key={k} className="rounded-md bg-pru-mist border border-pru-line p-3">
                <div className="label-kicker">{k.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-sm font-semibold text-pru-ink mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5 flex flex-col justify-center items-center text-center">
          <div className="label-kicker mb-3">Agent confidence</div>
          <ConfidenceMeter score={analysis.confidence} size={96} label={null} />
          <p className="text-xs text-pru-slate mt-3">Validated against sourced Singpass fields.</p>
        </div>
      </div>

      {/* Holistic coverage map — full FNA across every pillar */}
      <HolisticMap clientId={client.id} />

      {/* Coverage: strengths vs gaps */}
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 card p-5">
          <h3 className="flex items-center gap-2 font-extrabold text-good mb-3">
            <Icon name="check" className="w-5 h-5" strokeWidth={2.4} /> Coverage in place
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="rounded-md border border-pru-line p-3">
                <div className="text-sm font-semibold text-pru-ink">{s.item}</div>
                <div className="text-xs text-pru-slate">{s.detail}</div>
              </li>
            ))}
            {client.existingCoverage.map((c, i) => (
              <li key={'e' + i} className="flex items-center gap-2 text-xs text-pru-slate">
                <Icon name="check" className="w-3.5 h-3.5 text-good" strokeWidth={3} />
                {c.type}: {c.plan}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 card p-5">
          <h3 className="flex items-center gap-2 font-extrabold text-bad mb-3">
            <Icon name="alert" className="w-5 h-5" /> Coverage gaps identified
          </h3>
          <div className="space-y-3">
            {analysis.gaps.map((g, i) => (
              <div key={i} className="rounded-md border border-pru-line p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-pru-ink text-sm">{g.item}</span>
                  <div className="flex items-center gap-2">
                    {g.gapValue && <Badge tone="red">{g.gapValue}</Badge>}
                    <SeverityTag severity={g.severity} />
                  </div>
                </div>
                <p className="text-xs text-pru-slate mt-1">{g.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-up questions */}
      <div className="card p-5">
        <SectionTitle kicker="Ask the client" title="Smart follow-up questions" icon="spark" />
        <div className="space-y-3">
          {analysis.followUps.map((f, i) => (
            <div key={i} className="flex gap-3 rounded-md border border-pru-line p-4 hover:border-pru-red transition-colors">
              <div className="w-7 h-7 rounded-full bg-pru-red text-white font-bold text-sm flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-pru-ink">{f.q}</p>
                <p className="text-xs text-pru-slate mt-1 flex items-center gap-1.5">
                  <Icon name="spark" className="w-3.5 h-3.5 text-pru-red" /> Why ask: {f.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Handoff to Recommend */}
      <div className="card p-5 bg-pru-ink text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-extrabold text-lg">Needs profile complete</div>
          <p className="text-white/60 text-sm">Hand off to the Recommend Agent to generate a ranked product shortlist.</p>
        </div>
        <button onClick={onRecommend} className="btn-primary">
          Run Recommend Agent <Icon name="arrow" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function HolisticMap({ clientId }) {
  const data = getCoverageMap(clientId)
  if (!data) return null

  const toneClasses = {
    good: 'bg-good-soft text-good border-good/30',
    warn: 'bg-warn-soft text-warn border-warn/30',
    bad: 'bg-bad-soft text-bad border-bad/30',
    slate: 'bg-pru-mist text-pru-slate border-pru-line',
  }
  const dotClasses = { good: 'bg-good', warn: 'bg-warn', bad: 'bg-bad', slate: 'bg-pru-slate' }

  // Tally for the summary line.
  const counts = pillars.reduce(
    (acc, p) => {
      const s = data.map[p.key].status
      acc[s] = (acc[s] || 0) + 1
      return acc
    },
    {}
  )
  const scoreBand = data.overallScore >= 70 ? '#1B9E6B' : data.overallScore >= 50 ? '#C8881B' : '#D11425'

  return (
    <div className="card p-5">
      <SectionTitle
        kicker="Holistic needs analysis"
        title="Full coverage map — every pillar assessed"
        icon="scale"
        right={
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold">
            {Object.entries(statusMeta).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5 text-pru-slate">
                <span className={`w-2.5 h-2.5 rounded-full ${dotClasses[v.tone]}`} /> {v.label}
              </span>
            ))}
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Overall protection score */}
        <div className="lg:w-64 shrink-0 rounded-md bg-pru-ink text-white p-5 flex flex-col items-center text-center">
          <div className="label-kicker text-white/50">Protection score</div>
          <div className="relative my-3" style={{ width: 120, height: 120 }}>
            <svg width="120" height="120" className="-rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke={scoreBand}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 - (data.overallScore / 100) * 2 * Math.PI * 52}
                style={{ transition: 'stroke-dashoffset 1.1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold">{data.overallScore}</span>
              <span className="text-[10px] text-white/50">out of 100</span>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-snug">{data.headline}</p>
          <div className="mt-3 flex gap-2 text-[11px] font-bold">
            <span className="text-bad">{counts.gap || 0} gaps</span>
            <span className="text-warn">{counts.partial || 0} light</span>
            <span className="text-good">{counts.adequate || 0} ok</span>
          </div>
        </div>

        {/* Pillar grid */}
        <div className="flex-1 grid sm:grid-cols-2 gap-2.5">
          {pillars.map((p) => {
            const cell = data.map[p.key]
            const meta = statusMeta[cell.status]
            return (
              <div key={p.key} className={`rounded-md border p-3 ${toneClasses[meta.tone]}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name={p.icon} className="w-4 h-4 shrink-0" />
                    <span className="font-bold text-pru-ink text-[13px] truncate">{p.label}</span>
                  </div>
                  <span className="chip bg-white/70 text-[10px] font-bold shrink-0">{meta.label}</span>
                </div>
                <p className="text-[11px] text-pru-slate mt-1.5 leading-snug">{cell.note}</p>
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-4 text-[11px] text-pru-slate flex items-center gap-1.5">
        <Icon name="spark" className="w-3.5 h-3.5 text-pru-red" />
        The priority gaps and follow-up questions below are drilled out of this complete picture.
      </p>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div className="label-kicker">{label}</div>
      <div className="text-sm font-semibold text-pru-ink mt-0.5">{value}</div>
    </div>
  )
}
