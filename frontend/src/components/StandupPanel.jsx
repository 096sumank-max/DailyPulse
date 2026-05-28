import { useState } from 'react'

const API = 'http://localhost:8000'

/**
 * @param {{ completedCount: number }} props
 */
export default function StandupPanel({ completedCount }) {
  const [standup, setStandup] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/standup`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setStandup(data.standup)
    } catch {
      setError('Failed to generate standup — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!standup) return
    await navigator.clipboard.writeText(standup)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const iconBg = '#EEF2FF'
  const iconColor = '#4F46E5'

  if (completedCount === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col" style={{ minHeight: '200px' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Standup Generator</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Complete at least one task to generate your daily standup.
        </p>
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
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Standup Generator</h2>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-semibold"
          style={{ backgroundColor: '#ECFDF5', color: '#059669' }}
        >
          {completedCount} done
        </span>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-2.5 text-sm font-semibold text-white rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mb-4"
        style={{ backgroundColor: '#4F46E5' }}
        onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#4338CA')}
        onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#4F46E5')}
      >
        {loading ? (
          <>
            <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Generating…
          </>
        ) : (
          'Generate Standup'
        )}
      </button>

      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      {/* Result */}
      {standup && (
        <div className="animate-fade-in-up">
          <div
            className="rounded-xl p-4 mb-3 text-xs leading-relaxed whitespace-pre-line overflow-x-auto"
            style={{
              backgroundColor: '#0F172A',
              color: '#CBD5E1',
              fontFamily: "'Courier New', Courier, monospace",
              borderLeft: '3px solid #4F46E5',
            }}
          >
            {standup}
          </div>
          <button
            onClick={handleCopy}
            className={`w-full py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${copied ? 'animate-fade-out' : ''}`}
            style={{
              backgroundColor: copied ? '#ECFDF5' : '#F1F5F9',
              color: copied ? '#059669' : '#64748B',
            }}
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
