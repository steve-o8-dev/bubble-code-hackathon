import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Full-screen dimmed loading state shown while an agent "runs".
// Eases in over the whole viewport, holds for durationMs, fades back out,
// then calls onDone so the page can flip to its result phase.
export default function LoadingOverlay({ label, sublabel, durationMs = 2500, onDone }) {
  const [shown, setShown] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  // Mount transparent, then flip a tick later so the fade has an off-state to
  // animate from (an instant appearance is exactly what we're avoiding). A
  // timer rather than requestAnimationFrame — rAF never fires on a tab that
  // isn't painting, which would leave the overlay invisible for the whole run.
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 20)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const fadeOut = setTimeout(() => setShown(false), durationMs)
    const finish = setTimeout(() => onDoneRef.current && onDoneRef.current(), durationMs + 260)
    return () => {
      clearTimeout(fadeOut)
      clearTimeout(finish)
    }
  }, [durationMs])

  // Portalled to <body>: mounted inside the page it sat in the sticky header's
  // stacking context, so the header strip stayed uncovered at the top.
  return createPortal(
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity ${
        shown ? 'opacity-100 duration-500 ease-in' : 'opacity-0 duration-200 ease-out'
      }`}
    >
      <div className="absolute inset-0 bg-pru-ink/75 backdrop-blur-[3px]" />

      <div className="relative flex flex-col items-center">
        <svg className="w-16 h-16 animate-spin" viewBox="0 0 50 50" aria-hidden="true">
          <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="4" />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#ED1B2E"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="125.7"
            strokeDashoffset="94"
          />
        </svg>

        {label && (
          <div className="mt-5 text-center">
            <div className="text-white font-extrabold tracking-tight">{label}</div>
            {sublabel && <div className="mt-1 text-sm text-white/55">{sublabel}</div>}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
