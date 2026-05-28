/** News article skeleton */
function NewsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton rounded-lg" style={{ height: '14px', width: '80%' }} />
          <div className="skeleton rounded-lg" style={{ height: '12px', width: '60%' }} />
        </div>
      ))}
    </div>
  )
}

/**
 * @param {{ news: object|null, loading: boolean, error: string|null, onRefresh: () => void }} props
 */
export default function NewsPanel({ news, loading, error, onRefresh }) {
  return (
    <div
      className="p-px rounded-2xl"
      style={{ background: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)' }}
    >
      <div className="bg-white rounded-2xl px-6 py-7 lg:px-8 lg:py-8">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#DC2626">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2.5" stroke="white" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#DC2626' }}
            >
              Latest AI News
            </span>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors duration-150 cursor-pointer"
            style={{
              color: '#DC2626',
              backgroundColor: '#FEE2E2',
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#FECACA')}
            onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#FEE2E2')}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={loading ? 'spin' : ''}
            >
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {loading && <NewsSkeleton />}

        {!loading && error && (
          <div className="flex items-center gap-3 text-red-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {!loading && !error && news && (
          <div className="animate-fade-in space-y-4">
            {/* Summary */}
            {news.summary && (
              <p className="text-sm text-slate-600 italic border-l-2 border-slate-300 pl-4 mb-5">
                {news.summary}
              </p>
            )}

            {/* News list */}
            {news.news && news.news.length > 0 ? (
              <div className="space-y-4">
                {news.news.map((article, idx) => (
                  <a
                    key={idx}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-slate-200 transition-all duration-150 hover:border-slate-300 hover:shadow-md group"
                  >
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                      {article.snippet}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 truncate">
                        {new URL(article.url).hostname}
                      </span>
                      <span className="text-xs font-medium text-slate-500 ml-2">
                        {(article.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">No news available</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
