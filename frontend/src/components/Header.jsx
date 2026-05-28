/**
 * @param {{ onRefreshBriefing: () => void }} props
 */
export default function Header({ onRefreshBriefing }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200"
      style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo + name */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="white" />
              <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DailyPulse
          </span>
        </div>

        {/* Date + action */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-400 hidden sm:block">{dateStr}</span>
          <button
            onClick={onRefreshBriefing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 cursor-pointer"
            style={{ color: '#4F46E5', backgroundColor: '#EEF2FF' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E0E7FF')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#EEF2FF')}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            <span className="hidden sm:inline">Refresh Briefing</span>
            <span className="sm:hidden">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  )
}
