import { useState } from 'react'
import confetti from 'canvas-confetti'

/**
 * @param {{
 *   task: object,
 *   onComplete: (id: string) => Promise<void>,
 *   onDelete: (id: string) => Promise<void>
 * }} props
 */
export default function TaskCard({ task, onComplete, onDelete }) {
  const [checkedSubtasks, setCheckedSubtasks] = useState(new Set())
  const [completing, setCompleting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const isDone = task.completed

  const toggleSubtask = (i) => {
    if (isDone) return
    setCheckedSubtasks(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const handleComplete = async () => {
    setCompleting(true)
    setError(null)

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      duration: 2500,
    })

    try {
      await onComplete(task.id)
    } catch {
      setError('Could not complete task — try again.')
      setCompleting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(task.id)
    } catch {
      setError('Could not delete task — try again.')
      setDeleting(false)
    }
  }

  return (
    <div
      className="bg-white rounded-xl border transition-all duration-300 animate-fade-in-up"
      style={{
        borderColor: isDone ? '#A7F3D0' : '#E2E8F0',
        borderLeftWidth: '4px',
        borderLeftColor: isDone ? '#10B981' : '#4F46E5',
        opacity: deleting ? 0.5 : 1,
      }}
    >
      <div className="p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            {isDone && (
              <div
                className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#10B981' }}
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
            <h3
              className="font-semibold text-sm leading-snug"
              style={{ color: isDone ? '#94A3B8' : '#0F172A', textDecoration: isDone ? 'line-through' : 'none' }}
            >
              {task.title}
            </h3>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete task"
            className="flex-shrink-0 transition-colors duration-150 cursor-pointer disabled:opacity-40"
            style={{ color: '#CBD5E1' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F87171')}
            onMouseLeave={e => (e.currentTarget.style.color = '#CBD5E1')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>

        {/* Subtasks */}
        {task.subtasks?.length > 0 && (
          <ul className="space-y-2 mb-4">
            {task.subtasks.map((sub, i) => {
              const checked = isDone || checkedSubtasks.has(i)
              return (
                <li
                  key={i}
                  className="flex items-start gap-2.5 cursor-pointer group"
                  onClick={() => toggleSubtask(i)}
                >
                  <div
                    className="mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150"
                    style={{
                      backgroundColor: checked ? '#4F46E5' : 'transparent',
                      borderColor: checked ? '#4F46E5' : '#CBD5E1',
                    }}
                  >
                    {checked && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-xs leading-relaxed select-none"
                    style={{
                      color: checked ? '#94A3B8' : '#475569',
                      textDecoration: checked ? 'line-through' : 'none',
                    }}
                  >
                    {sub}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        {!isDone && (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
            onMouseEnter={e => !completing && (e.currentTarget.style.backgroundColor = '#E0E7FF')}
            onMouseLeave={e => !completing && (e.currentTarget.style.backgroundColor = '#EEF2FF')}
          >
            {completing ? (
              <>
                <svg className="spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Completing…
              </>
            ) : (
              'Mark Complete'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
