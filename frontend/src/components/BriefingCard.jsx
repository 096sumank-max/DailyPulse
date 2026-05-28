/** Shimmer skeleton row */
function SkeletonRow({ wide }) {
  return (
    <div
      className="skeleton rounded-lg"
      style={{ height: '14px', width: wide ? '70%' : '45%' }}
    />
  )
}

/** Full briefing skeleton */
function BriefingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <SkeletonRow wide />
        <div className="space-y-2">
          <SkeletonRow />
          <SkeletonRow wide />
          <SkeletonRow />
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#F8FAFC' }}>
          <SkeletonRow />
          <SkeletonRow wide />
        </div>
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#FFF7ED' }}>
          <SkeletonRow />
          <SkeletonRow wide />
          <SkeletonRow />
        </div>
      </div>
    </div>
  )
}

/**
 * @param {{ briefing: object|null, loading: boolean, error: string|null }} props
 */
export default function BriefingCard({ briefing, loading, error }) {
  return (
    <div
      className="p-px rounded-2xl"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)' }}
    >
      <div className="bg-white rounded-2xl px-6 py-7 lg:px-8 lg:py-8">
        {loading && <BriefingSkeleton />}

        {!loading && error && (
          <div className="flex items-center gap-3 text-red-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-sm">{error} — is the backend running?</span>
          </div>
        )}

        {!loading && !error && briefing && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Quote column */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#EEF2FF' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#4F46E5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                    </svg>
                  </div>
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: '#4F46E5' }}
                  >
                    Morning Briefing
                  </span>
                </div>
                <blockquote
                  className="text-slate-800 text-xl lg:text-2xl leading-relaxed"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                >
                  "{briefing.quote}"
                </blockquote>
              </div>

              {/* Tip + message column */}
              <div className="space-y-3">
                <div className="rounded-xl p-4" style={{ backgroundColor: '#F8FAFC' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Focus Tip
                  </p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {briefing.focus_tip}
                  </p>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: '#FFF7ED' }}>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: '#FB923C' }}
                  >
                    Today's Message
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{briefing.message}</p>
                </div>
              </div>
            </div>

            {/* Web Tip from Tavily */}
            {briefing.web_tip && (
              <div className="rounded-xl p-5" style={{ backgroundColor: '#F0FDF4', borderLeft: '4px solid #22C55E' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#16A34A' }}>
                  💡 Web Insight
                </p>
                <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                  {briefing.web_tip}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
