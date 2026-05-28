import { useState, useEffect } from 'react'
import Header from './components/Header'
import BriefingCard from './components/BriefingCard'
import TaskManager from './components/TaskManager'
import StandupPanel from './components/StandupPanel'
import InsightsPanel from './components/InsightsPanel'
import NewsPanel from './components/NewsPanel'
import './App.css'

const API = 'http://localhost:8000'

export default function App() {
  const [briefing, setBriefing] = useState(null)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const [briefingError, setBriefingError] = useState(null)

  const [news, setNews] = useState(null)
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState(null)

  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)

  const fetchBriefing = async () => {
    setBriefingLoading(true)
    setBriefingError(null)
    try {
      const res = await fetch(`${API}/briefing`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setBriefing(await res.json())
    } catch (err) {
      setBriefingError(err.message)
    } finally {
      setBriefingLoading(false)
    }
  }

  const fetchNews = async () => {
    setNewsLoading(true)
    setNewsError(null)
    try {
      const res = await fetch(`${API}/news/ai`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setNews(await res.json())
    } catch (err) {
      setNewsError(err.message)
    } finally {
      setNewsLoading(false)
    }
  }

  const fetchTasks = async () => {
    setTasksLoading(true)
    try {
      const res = await fetch(`${API}/tasks`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      setTasks(await res.json())
    } catch (err) {
      console.error('Failed to load tasks:', err)
    } finally {
      setTasksLoading(false)
    }
  }

  useEffect(() => {
    fetchBriefing()
    fetchNews()
    fetchTasks()
  }, [])

  /** @param {string} title */
  const handleAddTask = async (title) => {
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.detail ?? `Server error ${res.status}`)
    }
    const task = await res.json()
    setTasks(prev => [task, ...prev])
  }

  /** @param {string} id */
  const handleCompleteTask = async (id) => {
    const res = await fetch(`${API}/tasks/${id}/complete`, { method: 'PUT' })
    if (!res.ok) throw new Error(`Server error ${res.status}`)
    const updated = await res.json()
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)))
  }

  /** @param {string} id */
  const handleDeleteTask = async (id) => {
    const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
    if (!res.ok && res.status !== 204) throw new Error(`Server error ${res.status}`)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const today = (() => {
    const d = new Date()
    const dateLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    return dateLocal.toISOString().slice(0, 10)
  })()
  const completedToday = tasks.filter(
    t => t.completed && (t.completed_at ?? '').slice(0, 10) === today,
  )

  return (
    <div className="dot-grid min-h-screen">
      <Header onRefreshBriefing={fetchBriefing} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <BriefingCard briefing={briefing} loading={briefingLoading} error={briefingError} />
        <NewsPanel news={news} loading={newsLoading} error={newsError} onRefresh={fetchNews} />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[60%]">
            <TaskManager
              tasks={tasks}
              loading={tasksLoading}
              onAdd={handleAddTask}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
            />
          </div>
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <StandupPanel completedCount={completedToday.length} />
            <InsightsPanel taskCount={tasks.length} />
          </div>
        </div>
      </main>
    </div>
  )
}
