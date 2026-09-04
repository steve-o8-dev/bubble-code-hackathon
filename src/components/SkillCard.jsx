import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

// The agent's SKILLS.md ruleset — reinforces the "reads skills" step.
// Tucked behind a question-mark button so it never competes with the page
// content; the panel opens on click and closes on outside-click / Escape.
export default function SkillCard({ skill, accentTitle, live = false }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrap} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${accentTitle} — ruleset & instructions`}
        title="Ruleset & instructions"
        className={`relative w-9 h-9 rounded-full border flex items-center justify-center transition-colors ${
          open
            ? 'bg-pru-ink text-white border-pru-ink'
            : 'bg-white text-pru-slate border-pru-line hover:text-pru-ink hover:border-pru-slate'
        }`}
      >
        <Icon name="help" className="w-5 h-5" strokeWidth={2} />
        {live && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-good ring-2 ring-white animate-pulse" />
        )}
      </button>

      {open && (
        <div className="card absolute right-0 top-full mt-2 z-50 w-[380px] max-w-[85vw] overflow-hidden text-left shadow-pop animate-fade-up">
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
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-pru-ink font-semibold mb-3">{skill.purpose}</p>
            <ol className="space-y-2">
              {skill.rules.map((r, i) => (
                <li key={i} className="flex gap-2.5 text-[13px] text-pru-slate">
                  <span className="shrink-0 w-5 h-5 rounded-sm bg-bad-soft text-pru-red font-bold text-[11px] flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{r}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
