import { NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import { consultant } from '../data/agents.js'

const nav = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/simplify', label: 'Simplify Agent', icon: 'simplify', tag: 'Policy Explainer' },
  { to: '/discover', label: 'Discover Agent', icon: 'discover', tag: 'Needs Profiler' },
  { to: '/recommend', label: 'Recommend Agent', icon: 'recommend', tag: 'Decision Aid' },
  { to: '/audit', label: 'Audit & FEAT', icon: 'audit', tag: 'Governance' },
]

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-pru-red flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
        P
      </div>
      <div className="leading-tight">
        <div className="font-extrabold text-white tracking-tight">PRU<span className="text-pru-red">.</span>NAVIGATOR</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Agentic AI Advisory</div>
      </div>
    </div>
  )
}

export default function Layout({ children }) {
  const loc = useLocation()
  return (
    <div className="min-h-screen flex bg-pru-mist">
      {/* Sidebar */}
      <aside className="w-[264px] shrink-0 bg-pru-ink h-screen sticky top-0 z-40 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Wordmark />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-pru-red text-white shadow-sm' : 'text-white/65 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon name={n.icon} className="w-5 h-5 shrink-0" />
              <span className="flex-1">{n.label}</span>
              {n.tag && (
                <span className="pointer-events-none absolute left-full top-1/2 z-[100] ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-pru-ink-soft px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 shadow-pop ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100">
                  {n.tag}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-pru-ink-soft" />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-good mb-1.5">
              <Icon name="lock" className="w-3.5 h-3.5" />
              MAS FEAT-Aligned
            </div>
            <p className="text-[11px] text-white/45 leading-snug">
              Human-in-the-loop. Every recommendation is consultant-approved and audit-trailed.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-10 bg-white/85 backdrop-blur border-b border-pru-line">
          <div className="px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-pru-slate">
              <Icon name="cpu" className="w-4 h-4 text-pru-red" />
              <span className="font-semibold text-pru-ink">3-Engine Agentic Workspace</span>
              <span className="text-pru-line">/</span>
              <span className="capitalize">{loc.pathname === '/' ? 'Dashboard' : loc.pathname.slice(1)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="text-right leading-tight">
                  <div className="text-sm font-bold text-pru-ink">{consultant.name}</div>
                  <div className="text-[11px] text-pru-slate">{consultant.title}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-pru-ink text-white flex items-center justify-center text-sm font-bold">
                  {consultant.initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-7 max-w-[1280px] w-full mx-auto">{children}</main>

        <footer className="px-8 py-4 text-center text-[11px] text-pru-slate border-t border-pru-line">
          PRU.NAVIGATOR — Hackathon concept prototype · “AI prepares. The consultant decides. The customer wins.”
        </footer>
      </div>
    </div>
  )
}
