import Icon from './Icon.jsx'

// Shows the agent's SKILLS.md ruleset — reinforces the "reads skills" step.
export default function SkillCard({ skill, accentTitle, live = false }) {
  return (
    <div className="card overflow-hidden self-start">
      <div className="flex items-center justify-between px-4 py-3 bg-pru-ink text-white">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Icon name="doc" className="w-4 h-4 text-pru-red" />
          {accentTitle}
        </div>
        {live ? (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-good">
            <span className="w-1.5 h-1.5 rounded-full bg-good animate-pulse" /> loaded
          </span>
        ) : (
          <span className="text-[11px] text-white/40">skill ruleset</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-pru-ink font-semibold mb-3">{skill.purpose}</p>
        <ol className="space-y-2">
          {skill.rules.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-[13px] text-pru-slate">
              <span className="shrink-0 w-5 h-5 rounded-md bg-bad-soft text-pru-red font-bold text-[11px] flex items-center justify-center">
                {i + 1}
              </span>
              <span className="leading-snug">{r}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
