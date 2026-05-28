import { useState } from 'react'

const API = 'http://localhost:8000'
const THRESHOLD = 3

/**
 * @param {{ taskCount: number }} props
 */
export default function InsightsPanel({ taskCount }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/insights`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setInsights(data.insights)
    } catch {
      setError('Failed to generate insights — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const iconBg = '#FFF7ED'
  const iconColor = '#F97316'

  /* Locked state — not enough tasks yet */
  if (taskCount < THRESHOLD) {
    const progress = Math.round((taskCount / THRESHOLD) * 100)
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col" style={{ minHeight: '200px' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Daily Insights</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          Add {THRESHOLD - taskCount} more task{THRESHOLD - taskCount !== 1 ? 's' : ''} to unlock AI productivity insights.
        </p>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#F97316' }}
          />
        </div>
        <p className="text-xs text-slate-300 mt-1.5 text-right">{taskCount}/{THRESHOLD}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col" style={{ minHeight: '200px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Daily Insights</h2>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-semibold"
          style={{ backgroundColor: '#FFF7ED', color: '#EA580C' }}
        >
          {taskCount} tasks
        </span>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mb-4"
        style={{ backgroundColor: '#FFF7ED', color: '#EA580C' }}
        onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#FFEDD5')}
        onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#FFF7ED')}
      >
        {loading ? (
          <>
            <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Analyzing…
          </>
        ) : (
          'Get Insights'
        )}
      </button>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      {/* Result */}
      {insights && (
        <div
          className="animate-fade-in-up rounded-xl p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-line"
          style={{ backgroundColor: '#FFFBF5', borderLeft: '3px solid #F97316' }}
        >
          {insights}
        </div>
      )}
    </div>
  )
}
