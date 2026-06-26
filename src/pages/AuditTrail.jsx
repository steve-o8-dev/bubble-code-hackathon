import { useState } from 'react'
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

const PAGE_SIZES = [5, 10, 25]

export default function AuditTrail() {
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const total = auditTrail.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(page, totalPages)
  const startIdx = (current - 1) * pageSize
  const rows = auditTrail.slice(startIdx, startIdx + pageSize)

  const approvals = auditTrail.filter(
    (a) => a.actor.includes('FR') && (a.status === 'Approved' || a.status === 'Delivered')
  ).length
  const avgConfidence = Math.round(
    auditTrail.reduce((sum, a) => sum + a.confidence, 0) / total
  )

  const pager = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-xs text-pru-slate">
        Showing{' '}
        <span className="font-bold text-pru-ink">
          {total === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + pageSize, total)}
        </span>{' '}
        of <span className="font-bold text-pru-ink">{total}</span> events
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current <= 1}
            className="btn-ghost px-3 py-1.5 text-xs"
          >
            <Icon name="arrow" className="w-4 h-4 rotate-180" /> Prev
          </button>
          <span className="text-xs font-semibold text-pru-slate">
            Page <span className="text-pru-ink">{current}</span> / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current >= totalPages}
            className="btn-ghost px-3 py-1.5 text-xs"
          >
            Next <Icon name="arrow" className="w-4 h-4" />
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-pru-slate">
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
            className="rounded-lg border border-pru-line bg-white px-2.5 py-1.5 text-sm font-bold text-pru-ink focus:outline-none focus:ring-2 focus:ring-pru-red"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )

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
        <Stat value={total} label="Logged events" icon="audit" />
        <Stat value={approvals} label="Consultant approvals" icon="lock" tone="good" />
        <Stat value="100%" label="Outputs with sources" icon="doc" tone="red" />
        <Stat value={`${avgConfidence}%`} label="Avg. confidence" icon="cpu" tone="warn" />
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
      <div className="card p-5">
        <SectionTitle kicker="Immutable log" title="Audit trail" icon="audit" />

        {/* Top pagination bar */}
        <div className="mb-4 border-b border-pru-line pb-4">{pager}</div>

        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[860px] table-fixed">
          <thead>
            <tr className="text-left text-pru-slate border-b border-pru-line text-xs uppercase tracking-wide">
              <th className="py-2 pl-3 font-bold w-[52px]">#</th>
              <th className="py-2 font-bold w-[160px]">Event ID / Time</th>
              <th className="py-2 font-bold w-[110px]">Agent</th>
              <th className="py-2 font-bold w-[96px]">Actor</th>
              <th className="py-2 font-bold w-auto">Action</th>
              <th className="py-2 font-bold w-[84px]">FEAT</th>
              <th className="py-2 font-bold w-[64px]">Conf.</th>
              <th className="py-2 font-bold w-[140px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pru-line">
            {rows.map((a, i) => (
              <tr key={a.id} className="hover:bg-pru-mist">
                <td className="py-3 pl-3 text-xs font-bold text-pru-slate">{startIdx + i + 1}</td>
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
                <td className="py-3"><span className="whitespace-nowrap"><Badge tone={statusTone[a.status]}>{a.status}</Badge></span></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Bottom pagination bar */}
        <div className="mt-4 border-t border-pru-line pt-4">{pager}</div>
      </div>

      <div className="card p-6 bg-pru-ink text-white text-center">
        <p className="text-lg font-extrabold">“AI prepares. The consultant decides. The customer wins.”</p>
        <p className="text-white/50 text-sm mt-1">Scalable, compliant advisory — audit-ready, always.</p>
      </div>
    </div>
  )
}
