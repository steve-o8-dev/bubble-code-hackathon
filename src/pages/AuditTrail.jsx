import Icon from '../components/Icon.jsx'
import { Badge, SectionTitle, Stat } from '../components/ui.jsx'
import { featPrinciples, auditTrail } from '../data/governance.js'

const statusTone = {
  Approved: 'good',
  Delivered: 'good',
  Logged: 'slate',
  'Pending approval': 'warn',
}

const featColor = { F: 'good', E: 'info', A: 'warn', T: 'bad' }

export default function AuditTrail() {
  return (
    <div className="space-y-6">
      <div>
        <Badge tone="red" icon="lock">Governance</Badge>
        <h1 className="mt-2 text-2xl font-extrabold text-pru-ink">Audit trail & MAS FEAT alignment</h1>
        <p className="text-pru-slate mt-1 max-w-2xl">
          Every agent action and consultant decision is recorded with sources and confidence. The platform maps to MAS’s
          FEAT principles for responsible AI in financial services.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat value={auditTrail.length} label="Logged events" icon="audit" />
        <Stat value="2" label="Consultant approvals" icon="lock" tone="good" />
        <Stat value="100%" label="Outputs with sources" icon="doc" tone="red" />
        <Stat value="89%" label="Avg. confidence" icon="cpu" tone="warn" />
      </div>

      {/* FEAT principles */}
      <div>
        <SectionTitle kicker="Mapped to regulation" title="MAS FEAT principles" icon="scale" />
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {featPrinciples.map((f) => (
            <div key={f.key} className="card p-5">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-lg bg-${f.color}`}>
                  {f.key}
                </div>
                <div className="font-extrabold text-pru-ink">{f.name}</div>
              </div>
              <p className="mt-3 text-sm text-pru-ink font-medium">{f.statement}</p>
              <ul className="mt-3 space-y-1.5">
                {f.controls.map((c, i) => (
                  <li key={i} className="flex gap-2 text-xs text-pru-slate">
                    <Icon name="check" className={`w-3.5 h-3.5 shrink-0 mt-0.5 text-${f.color}`} strokeWidth={3} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Audit log */}
      <div className="card p-5 overflow-x-auto">
        <SectionTitle kicker="Immutable log" title="Audit trail" icon="audit" />
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left text-pru-slate border-b border-pru-line text-xs uppercase tracking-wide">
              <th className="py-2 font-bold">Event ID / Time</th>
              <th className="py-2 font-bold">Agent</th>
              <th className="py-2 font-bold">Actor</th>
              <th className="py-2 font-bold">Action</th>
              <th className="py-2 font-bold">FEAT</th>
              <th className="py-2 font-bold">Conf.</th>
              <th className="py-2 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pru-line">
            {auditTrail.map((a) => (
              <tr key={a.id} className="hover:bg-pru-mist">
                <td className="py-3">
                  <div className="font-mono text-xs text-pru-ink font-semibold">{a.id}</div>
                  <div className="text-[11px] text-pru-slate">{a.time}</div>
                </td>
                <td className="py-3"><Badge tone={a.actor === 'AI Agent' ? 'info' : 'dark'}>{a.agent}</Badge></td>
                <td className="py-3 text-pru-slate text-xs">{a.actor}</td>
                <td className="py-3">
                  <div className="font-semibold text-pru-ink">{a.action}</div>
                  <div className="text-[11px] text-pru-slate">{a.detail}</div>
                  {a.client !== '—' && <div className="text-[11px] text-pru-slate mt-0.5">Client: {a.client}</div>}
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    {a.feat.map((k) => (
                      <span key={k} className={`w-6 h-6 rounded-md text-white text-xs font-bold flex items-center justify-center bg-${featColor[k]}`}>{k}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 font-bold text-pru-ink">{a.confidence}%</td>
                <td className="py-3"><Badge tone={statusTone[a.status]}>{a.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-6 bg-pru-ink text-white text-center">
        <p className="text-lg font-extrabold">“AI prepares. The consultant decides. The customer wins.”</p>
        <p className="text-white/50 text-sm mt-1">Scalable, compliant advisory — audit-ready, always.</p>
      </div>
    </div>
  )
}
