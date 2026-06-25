// Small shared presentational primitives.
import Icon from './Icon.jsx'

export function Badge({ tone = 'slate', children, icon }) {
  const tones = {
    slate: 'bg-pru-mist text-pru-slate border border-pru-line',
    red: 'bg-bad-soft text-bad',
    good: 'bg-good-soft text-good',
    warn: 'bg-warn-soft text-warn',
    info: 'bg-info-soft text-info',
    dark: 'bg-pru-ink text-white',
  }
  return (
    <span className={`chip ${tones[tone]}`}>
      {icon && <Icon name={icon} className="w-3.5 h-3.5" strokeWidth={2.2} />}
      {children}
    </span>
  )
}

export function SeverityTag({ severity }) {
  const map = {
    high: { tone: 'red', label: 'High' },
    medium: { tone: 'warn', label: 'Medium' },
    low: { tone: 'slate', label: 'Low' },
  }
  const s = map[severity] || map.low
  return <Badge tone={s.tone}>{s.label}</Badge>
}

// Confidence ring + label. Color shifts by score band.
export function ConfidenceMeter({ score, size = 64, label = 'Confidence', stroke = 6 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const band = score >= 90 ? '#1B9E6B' : score >= 80 ? '#C8881B' : '#D11425'
  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EAECEF" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={band}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-extrabold text-pru-ink">{score}%</span>
        </div>
      </div>
      {label && (
        <div>
          <div className="label-kicker">{label}</div>
          <div className="text-sm font-semibold" style={{ color: band }}>
            {score >= 90 ? 'High confidence' : score >= 80 ? 'Moderate' : 'Review advised'}
          </div>
        </div>
      )}
    </div>
  )
}

export function ConfidenceBar({ score, className = '' }) {
  const band = score >= 90 ? 'bg-good' : score >= 80 ? 'bg-warn' : 'bg-bad'
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="label-kicker">Confidence</span>
        <span className="text-xs font-bold text-pru-ink">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-pru-line overflow-hidden">
        <div className={`h-full rounded-full ${band}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export function SourceChip({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-pru-mist border border-pru-line px-2 py-1 text-[11px] font-medium text-pru-slate font-mono">
      <Icon name="doc" className="w-3 h-3" />
      {children}
    </span>
  )
}

export function SectionTitle({ kicker, title, icon, right }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        {kicker && <div className="label-kicker mb-1">{kicker}</div>}
        <h2 className="text-xl font-extrabold text-pru-ink flex items-center gap-2">
          {icon && <Icon name={icon} className="w-5 h-5 text-pru-red" />}
          {title}
        </h2>
      </div>
      {right}
    </div>
  )
}

export function Stat({ value, label, tone = 'ink', icon }) {
  const tones = { ink: 'text-pru-ink', red: 'text-pru-red', good: 'text-good', warn: 'text-warn' }
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <span className="label-kicker">{label}</span>
        {icon && <Icon name={icon} className="w-4 h-4 text-pru-slate" />}
      </div>
      <div className={`mt-2 text-2xl font-extrabold ${tones[tone]}`}>{value}</div>
    </div>
  )
}
