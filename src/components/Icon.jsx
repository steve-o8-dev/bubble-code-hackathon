// Minimal inline-SVG icon set (no external icon dependency).
const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  simplify: <><path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M8 11h8M8 15h5" /></>,
  discover: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  recommend: <><path d="M3 17l6-6 4 4 7-7" /><path d="M14 7h7v7" /></>,
  audit: <><path d="M9 12l2 2 4-4" /><path d="M21 12c-1 0-3-1-3-3s2-3 3-3-3-1-3-3 1-3-3-3-3 2-3 0" /><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  umbrella: <><path d="M12 2v2" /><path d="M3 12a9 9 0 0 1 18 0Z" /><path d="M12 12v7a2 2 0 0 0 4 0" /></>,
  heart: <path d="M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 12 6 4.5 4.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />,
  gem: <><path d="M6 3h12l4 6-10 12L2 9Z" /><path d="M2 9h20M12 3 8 9l4 12 4-12-4-6" /></>,
  piggy: <><path d="M19 9V7a2 2 0 0 0-2-2H9a5 5 0 0 0-5 5v2a5 5 0 0 0 3 4.6V19h3v-2h2v2h3v-2.4A5 5 0 0 0 21 12" /><circle cx="16" cy="11" r="1" /></>,
  chart: <><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" /></>,
  tree: <><path d="M12 22v-7" /><path d="M9 8a3 3 0 0 1 6 0 3 3 0 0 1 2 5H7a3 3 0 0 1 2-5Z" /></>,
  check: <path d="m5 12 5 5L20 6" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  alert: <><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></>,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />,
  doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  link: <><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>,
  scale: <><path d="M12 3v18M5 21h14M7 7l-4 7h8ZM17 7l-4 7h8ZM7 7l5-2 5 2" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
}

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8, ...rest }) {
  const filled = name === 'shield' || name === 'heart' || name === 'bolt'
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths[name] || null}
    </svg>
  )
}
