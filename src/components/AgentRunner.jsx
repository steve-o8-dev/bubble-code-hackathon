import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

// Animated agent execution. Steps through the provided phases with simulated
// latency (spinner -> check), renders a live "agent console", then calls onDone.
export default function AgentRunner({ steps, accent = '#ED1B2E', stepMs = 900, onDone }) {
  const [active, setActive] = useState(0) // index currently running
  const [done, setDone] = useState(false)
  const logRef = useRef(null)

  useEffect(() => {
    if (active >= steps.length) {
      setDone(true)
      const t = setTimeout(() => onDone && onDone(), 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setActive((a) => a + 1), stepMs)
    return () => clearTimeout(t)
  }, [active, steps.length, stepMs, onDone])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [active])

  return (
    <div className="card overflow-hidden">
      {/* console header */}
      <div className="flex items-center justify-between px-5 py-3 bg-pru-ink text-white">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </span>
          <span className="ml-2 text-xs font-mono text-white/70">pru-navigator · agent runtime</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span
            className={`w-2 h-2 rounded-full ${done ? 'bg-good' : 'animate-pulse'}`}
            style={{ background: done ? '#1B9E6B' : accent }}
          />
          {done ? 'Completed' : 'Running'}
        </div>
      </div>

      {/* steps */}
      <div ref={logRef} className="px-5 py-4 max-h-[420px] overflow-y-auto bg-[#0f1116]">
        <div className="space-y-1.5 font-mono text-[13px]">
          {steps.map((s, i) => {
            const state = i < active ? 'done' : i === active ? 'running' : 'pending'
            if (state === 'pending') return null
            return (
              <div key={s.key} className="animate-fade-up">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">
                    {state === 'done' ? (
                      <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-good/15 text-good">
                        <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <span
                        className="inline-block w-5 h-5 rounded-full border-2 border-white/15 border-t-current animate-spin"
                        style={{ color: accent }}
                      />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className={state === 'done' ? 'text-white/90' : 'text-white font-semibold'}>
                      <span className="text-white/40">$ </span>
                      {s.label}
                    </div>
                    {s.detail && <div className="text-white/40 text-[11px] pl-3">↳ {s.detail}</div>}
                  </div>
                </div>
              </div>
            )
          })}
          {done && (
            <div className="animate-fade-up pt-2 text-good flex items-center gap-2">
              <Icon name="check" className="w-4 h-4" strokeWidth={3} />
              <span>Agent run finished — rendering results…</span>
            </div>
          )}
        </div>
      </div>

      {/* progress */}
      <div className="h-1 bg-pru-line">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(Math.min(active, steps.length) / steps.length) * 100}%`, background: accent }}
        />
      </div>
    </div>
  )
}
