import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import LoadingOverlay from '../components/LoadingOverlay.jsx'
import SkillCard from '../components/SkillCard.jsx'
import { Badge, ConfidenceMeter, ConfidenceBar, SectionTitle, SourceChip } from '../components/ui.jsx'
import { clients, getClient } from '../data/clients.js'
import { getProduct } from '../data/products.js'
import { getAnalysis } from '../data/analysis.js'
import { skills, consultant } from '../data/agents.js'

const money = (n) => (n === 0 ? '—' : 'S$' + n.toLocaleString('en-SG') + '/mo')

export default function Recommend() {
  const loc = useLocation()
  const [selected, setSelected] = useState(loc.state?.clientId || null)
  const [phase, setPhase] = useState(loc.state?.clientId ? 'running' : 'select')
  const [approved, setApproved] = useState(false)
  const client = getClient(selected)
  const rec = client ? getAnalysis(client.id)?.recommend : null

  // Scroll back to the top when the agent starts running / shows results.
  useEffect(() => {
    if (phase !== 'select') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [phase])

  const reset = () => {
    setPhase('select')
    setSelected(null)
    setApproved(false)
  }

  const header = (
    <div>
      <Badge tone="red" icon="recommend">Recommend Agent · Decision Aid</Badge>
      <div className="mt-1 flex items-center gap-2 flex-wrap">
        <h1 className="text-[22px] font-extrabold text-pru-ink">Ranked product shortlist — compared</h1>
        <SkillCard skill={skills.recommend} accentTitle="recommend.SKILLS.md" live={phase === 'running'} />
      </div>
      <p className="text-sm text-pru-slate mt-1 max-w-4xl">
        A shortlist ranked on what the client needs — never on what pays the most, with reasons, tradeoffs and sources.
      </p>
    </div>
  )

  const stepsRow = () => (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <FlowSteps phase={phase} approved={approved} />
      {phase !== 'select' && (
        <button onClick={reset} className="btn-primary">
          <Icon name="arrow" className="w-4 h-4 rotate-180" /> New shortlist
        </button>
      )}
    </div>
  )

  if (phase === 'result') {
    return (
      <div className="space-y-6">
        {header}
        {stepsRow()}
        <Result client={client} rec={rec} approved={approved} onApprove={() => setApproved(true)} />
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
          title="Select a client (with a completed needs profile)"
          icon="user"
          right={
            <button disabled={!selected} onClick={() => setPhase('running')} className="btn-primary shrink-0">
              <Icon name="bolt" className="w-4 h-4" /> Generate shortlist
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
                <Badge tone="good" icon="check">Profile ready</Badge>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="font-extrabold text-pru-ink truncate">{c.name}</span>
                {selected === c.id && <Icon name="check" className="w-4 h-4 text-pru-red shrink-0" strokeWidth={3} />}
              </div>
              <div className="text-xs text-pru-slate">{c.lifeStage}</div>
              <div className="mt-3 pt-3 border-t border-pru-line text-xs text-pru-slate">
                Top need: <span className="font-semibold text-pru-ink">{getAnalysis(c.id)?.discover.needsProfile.topNeed}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {phase === 'running' && (
        <LoadingOverlay
          label="Recommend Agent"
          sublabel={`Matching products for ${client.name}…`}
          onDone={() => setPhase('result')}
        />
      )}
    </div>
  )
}

function FlowSteps({ phase, approved }) {
  const steps = ['Select client', 'Agent ranking', 'Compare & approve']
  const idx = phase === 'select' ? 0 : phase === 'running' ? 1 : 2
  return (
    <div className="flex items-center text-sm flex-wrap">
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
      {approved && <span className="ml-3"><Badge tone="good" icon="check">Approved by consultant</Badge></span>}
    </div>
  )
}

function Result({ client, rec, approved, onApprove }) {
  const items = rec.shortlist
  return (
    <div className="space-y-5 animate-fade-up">
      {/* Fairness banner */}
      <div className="card p-4 flex flex-wrap items-center gap-4 border-l-4 border-l-good">
        <Icon name="scale" className="w-6 h-6 text-good shrink-0" />
        <div className="flex-1 min-w-[240px]">
          <div className="font-bold text-pru-ink text-sm">Ranked on client needs — not commission</div>
          <p className="text-xs text-pru-slate">Product payout is deliberately excluded from scoring (MAS FEAT · Fairness).</p>
        </div>
        <ConfidenceMeter score={rec.confidence} size={64} label="Overall" />
      </div>

      <div className="card p-5">
        <SectionTitle kicker="Agent rationale" title={`Shortlist for ${client.name}`} icon="recommend" />
        <p className="text-sm text-pru-slate">{rec.summary}</p>
      </div>

      {/* Side-by-side comparison */}
      <div>
        <SectionTitle kicker="Compare" title="Side-by-side comparison" icon="scale" />
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((it) => {
            const p = getProduct(it.productId)
            return (
              <div key={it.productId} className={`card p-5 flex flex-col ${it.rank === 1 ? 'ring-2 ring-pru-red' : ''}`}>
                <div className="flex items-center justify-between">
                  <Badge tone={it.rank === 1 ? 'red' : 'slate'}>#{it.rank} {it.rank === 1 ? 'Best fit' : 'Alternative'}</Badge>
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${it.rank === 1 ? 'bg-pru-red text-white' : 'bg-bad-soft text-pru-red'}`}>
                    <Icon name={p.icon} className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="mt-3 font-extrabold text-pru-ink leading-tight">{p.name}</h3>
                <div className="text-xs text-pru-slate">{p.type}</div>

                <div className="mt-3 rounded-md bg-pru-mist border border-pru-line p-3 space-y-2">
                  <Row label="Needs-fit" value={`${it.needsFitScore}/100`} bold />
                  <Row label="Coverage" value={it.coverageFor} />
                  <Row label="Est. premium" value={it.singlePremium || money(it.monthly)} />
                </div>

                {/* fit gauge */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-semibold text-pru-slate mb-1">
                    <span>Needs-fit score</span><span className="text-pru-ink">{it.needsFitScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-pru-line overflow-hidden">
                    <div className="h-full rounded-full bg-pru-red" style={{ width: `${it.needsFitScore}%` }} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-bold text-good uppercase tracking-wide mb-1.5">Why it fits</div>
                  <ul className="space-y-1.5">
                    {it.whyItFits.map((w, i) => (
                      <li key={i} className="flex gap-2 text-xs text-pru-slate">
                        <Icon name="check" className="w-3.5 h-3.5 text-good shrink-0 mt-0.5" strokeWidth={3} /> {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] font-bold text-warn uppercase tracking-wide mb-1.5">Tradeoffs</div>
                  <ul className="space-y-1.5">
                    {it.tradeoffs.map((t, i) => (
                      <li key={i} className="flex gap-2 text-xs text-pru-slate">
                        <Icon name="alert" className="w-3.5 h-3.5 text-warn shrink-0 mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {it.needsMatched.map((n) => (
                    <span key={n} className="chip bg-bad-soft text-pru-red text-[10px]">{n}</span>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <ConfidenceBar score={it.confidence} className="mb-2" />
                  <div className="flex flex-wrap gap-1.5">
                    {it.sources.map((s) => (
                      <SourceChip key={s}>{s}</SourceChip>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Comparison matrix */}
      <div className="card p-5 overflow-x-auto">
        <SectionTitle kicker="At a glance" title="Comparison matrix" icon="dashboard" />
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-pru-slate border-b border-pru-line">
              <th className="py-2 font-semibold">Criterion</th>
              {items.map((it) => (
                <th key={it.productId} className="py-2 font-bold text-pru-ink">#{it.rank} {getProduct(it.productId).name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pru-line">
            <MatrixRow label="Needs-fit score" cells={items.map((i) => `${i.needsFitScore}/100`)} />
            <MatrixRow label="Confidence" cells={items.map((i) => `${i.confidence}%`)} />
            <MatrixRow label="Est. premium" cells={items.map((i) => i.singlePremium || money(i.monthly))} />
            <MatrixRow label="Coverage" cells={items.map((i) => i.coverageFor)} />
            <MatrixRow label="Category" cells={items.map((i) => getProduct(i.productId).category)} />
            <MatrixRow label="Payout tier (ignored in ranking)" cells={items.map((i) => getProduct(i.productId).payoutTier)} muted />
          </tbody>
        </table>
      </div>

      {/* Approval gate */}
      {!approved ? (
        <div className="card p-5 bg-pru-ink text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Icon name="lock" className="w-6 h-6 text-pru-red mt-0.5" />
              <div>
                <div className="font-extrabold text-lg">Consultant approval required</div>
                <p className="text-white/60 text-sm max-w-xl">
                  Nothing reaches the client until you approve. As {consultant.name} ({consultant.masRep}), you can adjust the
                  ranking, then approve — your decision is recorded in the audit trail.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn bg-white/10 text-white hover:bg-white/15">
                <Icon name="recommend" className="w-4 h-4" /> Adjust ranking
              </button>
              <button onClick={onApprove} className="btn-primary">
                <Icon name="check" className="w-4 h-4" strokeWidth={3} /> Approve shortlist
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-5 border-l-4 border-l-good animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-good-soft text-good flex items-center justify-center">
                <Icon name="check" className="w-6 h-6" strokeWidth={3} />
              </div>
              <div>
                <div className="font-extrabold text-pru-ink">Approved & ready to deliver to client</div>
                <p className="text-sm text-pru-slate">
                  Approved by {consultant.name} · {consultant.masRep} · logged to audit trail (AUD-2026-0616-021)
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge tone="good" icon="check">Human-in-the-loop</Badge>
              <Badge tone="info" icon="lock">FEAT · Accountability</Badge>
              <Badge tone="dark" icon="audit">Audit-trailed</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-pru-slate">{label}</span>
      <span className={`text-right ${bold ? 'font-extrabold text-pru-ink' : 'font-semibold text-pru-ink'}`}>{value}</span>
    </div>
  )
}

function MatrixRow({ label, cells, muted }) {
  return (
    <tr>
      <td className={`py-2.5 ${muted ? 'text-pru-slate italic' : 'text-pru-slate'}`}>{label}</td>
      {cells.map((c, i) => (
        <td key={i} className={`py-2.5 font-semibold ${muted ? 'text-pru-slate' : 'text-pru-ink'}`}>{c}</td>
      ))}
    </tr>
  )
}
