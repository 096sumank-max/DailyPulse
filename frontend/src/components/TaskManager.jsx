import { useState } from 'react'
import TaskCard from './TaskCard'

/**
 * @param {{
 *   tasks: object[],
 *   loading: boolean,
 *   onAdd: (title: string) => Promise<void>,
 *   onComplete: (id: string) => Promise<void>,
 *   onDelete: (id: string) => Promise<void>
 * }} props
 */
export default function TaskManager({ tasks, loading, onAdd, onComplete, onDelete }) {
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState(null)
  const [completedExpanded, setCompletedExpanded] = useState(false)

  const today = (() => {
    const d = new Date()
    const dateLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    return dateLocal.toISOString().slice(0, 10)
  })()
  const inProgress = tasks.filter(t => !t.completed)
  const completedToday = tasks.filter(
    t => t.completed && (t.completed_at ?? '').slice(0, 10) === today,
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    setAdding(true)
    setAddError(null)
    try {
      await onAdd(trimmed)
      setInput('')
    } catch (err) {
      setAddError(err.message ?? 'Failed to add task — is the backend running?')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Input area */}
      <div className="px-5 py-5 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#EEF2FF' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          Smart Task Manager
        </h2>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a task — AI will break it into subtasks…"
            disabled={adding}
            className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 transition-all duration-150 disabled:opacity-60 outline-none"
            style={{ fontFamily: 'inherit' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#4F46E5')}
            onBlur={e => (e.currentTarget.style.borderColor = '#E2E8F0')}
          />
          <button
            type="submit"
            disabled={adding || !input.trim()}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-60 flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: '#4F46E5' }}
            onMouseEnter={e => !adding && (e.currentTarget.style.backgroundColor = '#4338CA')}
            onMouseLeave={e => !adding && (e.currentTarget.style.backgroundColor = '#4F46E5')}
          >
            {adding ? (
              <>
                <svg className="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Thinking…
              </>
            ) : (
              'Add Task'
            )}
          </button>
        </form>

        {addError && (
          <p className="text-xs text-red-500 mt-2">{addError}</p>
        )}
      </div>

      {/* Task lists */}
      <div className="p-5 space-y-6 max-h-[580px] overflow-y-auto task-scroll">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-slate-100 p-4 space-y-2.5">
                <div className="skeleton rounded h-4 w-3/4" />
                <div className="skeleton rounded h-3 w-1/2" />
                <div className="skeleton rounded h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* In Progress */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4F46E5' }} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  In Progress
                  <span className="font-normal text-slate-300 ml-1.5">({inProgress.length})</span>
                </span>
              </div>

              {inProgress.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-100 py-12 px-6 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#F0F9FF' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <path d="M12 3v18M3 12h18" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">Add your first task</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs">Get started by adding a task above — AI will automatically break it into subtasks to help you stay focused.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inProgress.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={onComplete}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Today */}
            {completedToday.length > 0 && (
              <div>
                <button
                  onClick={() => setCompletedExpanded(v => !v)}
                  className="w-full flex items-center gap-2 mb-3 group cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#10B981' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Completed Today
                    <span className="font-normal text-slate-300 ml-1.5">({completedToday.length})</span>
                  </span>
                  <svg
                    className="ml-auto transition-transform duration-200 text-slate-300"
                    style={{ transform: completedExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {completedExpanded && (
                  <div className="space-y-3 animate-fade-in-up">
                    {completedToday.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={onComplete}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
