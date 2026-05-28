# DailyPulse Architecture Diagrams

Visual representations of how DailyPulse works

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         FRONTEND (React + Tailwind CSS)                  │   │
│  │         Port: 5173                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   Header     │  │ Briefing     │  │   News       │  │   │
│  │  │  Component   │  │   Card       │  │   Panel      │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │  ┌──────────────┐  ┌──────────────┐                     │   │
│  │  │ TaskManager  │  │   Standup    │  ┌──────────────┐  │   │
│  │  │  & TaskCard  │  │   & Insights │  │   Animations │  │   │
│  │  └──────────────┘  └──────────────┘  │  (Confetti)  │  │   │
│  │                                       └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────┬──────────────────────────────────────────┘
                        │
              HTTP Requests (fetch API)
                   JSON over HTTPS
                        │
┌───────────────────────▼──────────────────────────────────────────┐
│                   YOUR COMPUTER / SERVER                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │        BACKEND (Python FastAPI)                         │   │
│  │        Port: 8000                                       │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  main.py - API Routes & HTTP Handlers           │  │   │
│  │  │  ├─ GET    /tasks                               │  │   │
│  │  │  ├─ POST   /tasks                               │  │   │
│  │  │  ├─ PUT    /tasks/{id}/complete                 │  │   │
│  │  │  ├─ DELETE /tasks/{id}                          │  │   │
│  │  │  ├─ GET    /briefing                            │  │   │
│  │  │  ├─ GET    /standup                             │  │   │
│  │  │  ├─ GET    /insights                            │  │   │
│  │  │  └─ GET    /news/ai                             │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  services.py - Business Logic & AI Calls        │  │   │
│  │  │  ├─ read/write JSON files                       │  │   │
│  │  │  ├─ call Gemini API                             │  │   │
│  │  │  ├─ call Tavily API                             │  │   │
│  │  │  ├─ timezone conversion                         │  │   │
│  │  │  └─ data filtering & processing                 │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│           │              │              │                        │
│           ▼              ▼              ▼                        │
│  ┌──────────────┐ ┌────────────┐ ┌──────────────┐              │
│  │ data/        │ │  Gemini    │ │   Tavily     │              │
│  │ tasks.json   │ │   API      │ │   API        │              │
│  │ briefing.json│ │ (Google)   │ │ (Web Search) │              │
│  └──────────────┘ └────────────┘ └──────────────┘              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

### Example: Creating a Task

```
User Types "Review PRs"
         │
         ▼
   ┌──────────────┐
   │ React State  │  setInput("Review PRs")
   │ Updates      │
   └──────────────┘
         │
         ▼
   ┌──────────────────────┐
   │  Form Submission     │
   │  handleSubmit()      │
   │  onAdd(title)        │
   └──────────────────────┘
         │
         ▼
   ┌──────────────────────────────┐
   │ Frontend API Call            │
   │ fetch('http://localhost:8000 │
   │        /tasks', {            │
   │  method: 'POST',             │
   │  body: JSON.stringify({      │
   │    title: "Review PRs"       │
   │  })                          │
   └──────────────────────────────┘
         │
         ▼ (HTTP POST)
   ┌──────────────────────────────┐
   │ Backend Receives Request     │
   │ main.py: @app.post("/tasks") │
   │ await create_task(title)     │
   └──────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────┐
   │ Call Gemini AI              │
   │ "Break 'Review PRs' into   │
   │  3-5 concrete subtasks"     │
   └──────────────────────────────┘
         │
         ▼ (HTTPS to Google)
   ┌──────────────────────────────┐
   │ Gemini Response              │
   │ [                            │
   │   "Check branches",          │
   │   "Run tests",               │
   │   "Leave comments",          │
   │   "Approve/request changes"  │
   │ ]                            │
   └──────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────┐
   │ Create Task Object           │
   │ {                            │
   │   id: "uuid",                │
   │   title: "Review PRs",       │
   │   subtasks: [...],           │
   │   completed: false,          │
   │   created_at: "2026-05-29.." │
   │ }                            │
   └──────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────┐
   │ Save to tasks.json           │
   │ Read existing tasks          │
   │ Append new task              │
   │ Write back to file           │
   └──────────────────────────────┘
         │
         ▼ (HTTP 200 OK)
   ┌──────────────────────────────┐
   │ Return to Frontend           │
   │ {                            │
   │   id: "uuid",                │
   │   title: "Review PRs",       │
   │   subtasks: [...],           │
   │   completed: false,          │
   │   created_at: "2026-05-29.." │
   │ }                            │
   └──────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────┐
   │ Update React State           │
   │ setTasks([newTask, ...])     │
   │ Clear input field            │
   └──────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────┐
   │ Re-render Component          │
   │ Display new task with        │
   │ fade-in animation            │
   └──────────────────────────────┘
```

---

## Component Hierarchy

```
┌─────────────────────────────────────────────┐
│            App.jsx                          │
│  (Manages global state & API calls)         │
└───────────┬─────────────────────────────────┘
            │
    ┌───────┼───────────┬──────────────┬──────┐
    │       │           │              │      │
    ▼       ▼           ▼              ▼      ▼
┌────┐  ┌────────────┐ ┌──────┐  ┌────────┐ ┌─────┐
│Head│  │NewsPanel   │ │Layout│  │Standup │ │Insight
└────┘  │            │ ├──────┤  │Panel   │ │Panel
        │ AI News    │ │      │  │        │ └─────┘
        │ List       │ │Left: │  │Generates│
        │            │ │60%   │  │Standup  │
        │            │ │      │  │from     │
        │            │ │TaskM-│  │tasks    │
        │            │ │anager│  │         │
        └────────────┘ │      │  └────────┘
                       │Right:│
                       │40%   │
                       │      │
                       │Panels│
                       └──────┘
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
       ┌─────────┐  ┌──────────┐  ┌────────┐
       │Briefing │  │TaskManager│  │(other) │
       │Card     │  │   &       │  │panels  │
       │         │  │ TaskCard  │  │        │
       │(morning)│  │           │  │        │
       │briefing)│  ├──────────┐│  │        │
       └─────────┘  │ In Progress││  │        │
                    │ section   ││  │        │
                    │  - Subtasks││  │        │
                    │  - Checkbox││  │        │
                    │  - Complete││  │        │
                    │  - Delete  ││  │        │
                    ├──────────┐│  │        │
                    │Completed ││  │        │
                    │ Today    ││  │        │
                    │ (collapse)││  │        │
                    └──────────┘│  └────────┘
                    └──────────┘
```

---

## Data Flow: Task Completion

```
User clicks "Mark Complete" button
         │
         ▼
   ┌─────────────────────┐
   │ handleComplete()     │
   │ (in TaskCard.jsx)    │
   └─────────────────────┘
         │
         ├─ Show spinner: completing = true
         │
         ├─ Play confetti animation
         │  confetti({
         │    particleCount: 80,
         │    spread: 70,
         │    duration: 2500
         │  })
         │
         └──► API Call
              │
              ▼
         ┌─────────────────────────────┐
         │ fetch('/tasks/{id}/complete')│
         │ method: 'PUT'                │
         └─────────────────────────────┘
              │
              ▼ (HTTP over network)
         ┌─────────────────────────────┐
         │ Backend Receives PUT Request │
         │ main.py:                     │
         │ @app.put("/tasks/{id}..")    │
         └─────────────────────────────┘
              │
              ▼
         ┌─────────────────────────────┐
         │ services.complete_task(id)  │
         │ 1. Read tasks.json          │
         │ 2. Find task by id          │
         │ 3. Set completed = True     │
         │ 4. Set completed_at =       │
         │    datetime.now(IST)        │
         │    "2026-05-29T14:30:00.."  │
         └─────────────────────────────┘
              │
              ▼
         ┌─────────────────────────────┐
         │ Write back to tasks.json    │
         │ All tasks array updated     │
         └─────────────────────────────┘
              │
              ▼
         ┌─────────────────────────────┐
         │ Return Updated Task to      │
         │ Frontend (JSON)             │
         │ {                           │
         │   completed: true,          │
         │   completed_at: "2026-05.." │
         │ }                           │
         └─────────────────────────────┘
              │
              ▼
         ┌─────────────────────────────┐
         │ React State Updates         │
         │ setTasks(prev =>            │
         │   prev.map(t =>             │
         │     t.id === id ?           │
         │       updated : t           │
         │   )                         │
         │ )                           │
         └─────────────────────────────┘
              │
              ▼
         ┌─────────────────────────────┐
         │ Component Re-renders        │
         │ - Task shows checkmark      │
         │ - Text becomes strikethrough│
         │ - Border turns green        │
         │ - Task moves to "Completed" │
         │ - Button disappears         │
         │ - Confetti still animating! │
         └─────────────────────────────┘
```

---

## API Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                       │
│                   (main.py)                             │
├─────────────────────────────────────────────────────────┤
│  Task Endpoints                                         │
│  ├─ GET /tasks                                          │
│  │   └─ Calls: services.get_tasks()                    │
│  │       └─ Returns: List[Task]                        │
│  │                                                      │
│  ├─ POST /tasks                                         │
│  │   └─ Calls: services.create_task(title)             │
│  │       └─ Calls: Gemini API                          │
│  │       └─ Returns: Task with subtasks                │
│  │                                                      │
│  ├─ PUT /tasks/{id}/complete                           │
│  │   └─ Calls: services.complete_task(id)              │
│  │       └─ Records timestamp (IST)                    │
│  │       └─ Returns: Updated Task                      │
│  │                                                      │
│  └─ DELETE /tasks/{id}                                 │
│      └─ Calls: services.delete_task(id)                │
│          └─ Returns: Boolean success                   │
├─────────────────────────────────────────────────────────┤
│  Briefing Endpoints                                     │
│  ├─ GET /briefing                                       │
│  │   └─ Calls: services.get_or_create_briefing()       │
│  │       ├─ If today's briefing cached:                │
│  │       │  └─ Return from briefing.json               │
│  │       └─ Else:                                      │
│  │          ├─ Call Gemini API                         │
│  │          ├─ Call Tavily for web tip                 │
│  │          └─ Cache and return                        │
│  │              Returns: Briefing object               │
├─────────────────────────────────────────────────────────┤
│  Analysis Endpoints                                     │
│  ├─ GET /standup                                        │
│  │   └─ Calls: services.generate_standup()             │
│  │       ├─ Filter tasks completed today               │
│  │       └─ Call Gemini to write standup               │
│  │           Returns: Standup text                     │
│  │                                                      │
│  ├─ GET /insights                                       │
│  │   └─ Calls: services.generate_insights()            │
│  │       ├─ Filter tasks created today                 │
│  │       └─ Call Gemini for insights                   │
│  │           Returns: Insights text                    │
├─────────────────────────────────────────────────────────┤
│  News Endpoint                                          │
│  └─ GET /news/ai                                        │
│      └─ Calls: services.get_latest_ai_news()           │
│          └─ Call Tavily search                         │
│              Returns: News articles                    │
└─────────────────────────────────────────────────────────┘
```

---

## Data Persistence Layer

```
┌──────────────────────────────────────────┐
│       backend/data/                      │
│  JSON File Storage                       │
└──────────────────────────────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────────────┐  ┌─────────────────┐
│ tasks.json     │  │ briefing.json   │
│                │  │                 │
│ Stores:        │  │ Stores:         │
│ - All tasks    │  │ - Briefing      │
│ - Subtasks     │  │   cache by date │
│ - Completion   │  │ - Quote         │
│   status       │  │ - Focus tip     │
│ - Timestamps   │  │ - Message       │
│                │  │ - Web tip       │
│ Format:        │  │                 │
│ [              │  │ Format:         │
│   {            │  │ {               │
│     id: "...",  │  │   "2026-05-29": │
│     title: "...",│ │   {             │
│     completed:  │  │     date: "..." │
│       true/false│  │     quote: "..." │
│     ...         │  │     ...         │
│   }            │  │   }             │
│ ]              │  │ }               │
└────────────────┘  └─────────────────┘
    │                  │
    └──────┬───────────┘
           │
           ▼
    ┌────────────────┐
    │ services.py    │
    │ Read/Write     │
    │ Functions      │
    │                │
    │ _read_tasks()  │
    │ _write_tasks() │
    │ _read_brief()  │
    │ _write_brief() │
    └────────────────┘
           │
           ▼
    ┌────────────────┐
    │ main.py        │
    │ API Routes     │
    └────────────────┘
           │
           ▼
    ┌────────────────┐
    │ Frontend       │
    │ (React)        │
    └────────────────┘
```

---

## Timezone Conversion Flow

```
User in India (UTC+5:30)
Completes task at 2:30 PM local time
         │
         ▼
┌────────────────────────────┐
│ Frontend captures          │
│ timestamp (local browser)  │
│ Doesn't store it here,     │
│ sends task ID to backend   │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Backend Receives           │
│ complete_task(task_id)     │
│ Call                       │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ services.complete_task()   │
│                            │
│ tz_offset = timezone(      │
│   timedelta(hours=5,       │
│     minutes=30)            │
│ )                          │
│                            │
│ completed_at =             │
│   datetime.now(tz_offset)  │
│   .isoformat()             │
│                            │
│ Result:                    │
│ "2026-05-29T14:30:00+05:30"│
│                  ^^^^^^    │
│              IST timezone  │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Stored in tasks.json       │
│ with timezone info         │
│ So filtering "today"       │
│ works correctly            │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ When generating standup:   │
│ Filter tasks where         │
│ completed_at.slice(0,10)   │
│ == today's date (IST)      │
│                            │
│ Compare:                   │
│ "2026-05-29T14:30..." vs   │
│ "2026-05-29" (today)       │
│ ✅ Match! Include in standup│
└────────────────────────────┘
```

---

## Cloud Automation (Morning Briefing Routine)

```
Every Weekday at 9:00 AM India Time
         │
         ▼ (3:30 AM UTC)
┌────────────────────────────┐
│ Cloud Environment Triggers  │
│ (Anthropic Remote Execution)│
│                            │
│ Routine ID:                │
│ trig_017WvnvUHunKYRNyiKd.. │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ 1. Clone Repository        │
│ git clone                  │
│   https://github.com/      │
│   096sumank-max/DailyPulse │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ 2. Create .env File        │
│                            │
│ GEMINI_API_KEY=...         │
│ TAVILY_API_KEY=...         │
│ TAVILY_ENABLED=true        │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ 3. Start Backend Server    │
│                            │
│ python -m uvicorn          │
│ main:app --reload          │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ 4. Fetch Morning Briefing  │
│                            │
│ GET /briefing              │
│ ├─ Generate with Gemini    │
│ └─ Add web tip from Tavily │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ 5. Get All Tasks           │
│                            │
│ GET /tasks                 │
│ Filter incomplete from      │
│ yesterday                  │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ 6. Format & Display        │
│                            │
│ Print to terminal:         │
│ - Quote                    │
│ - Focus tip                │
│ - Message                  │
│ - Web tip                  │
│ - Incomplete tasks         │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Output viewable at:        │
│ https://claude.ai/code/    │
│ routines/trig_017Wvn...    │
│                            │
│ Shows run history and      │
│ outputs                    │
└────────────────────────────┘
```

---

## Browser Event Flow

```
User Action → Event → Handler → API Call → State Update → Re-render

┌──────────────────────────────────────────────────────────────┐
│  User Types "Review PRs" in Input                           │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Input onChange Event Triggered                             │
│  React handler: (e) => setInput(e.target.value)            │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Input State Updated                                        │
│  input = "Review PRs"                                      │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Component Re-renders (because state changed)              │
│  Input field shows "Review PRs"                            │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  User Clicks "Add Task" Button                              │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Form Submit Event → handleSubmit(e)                        │
│  e.preventDefault()  (prevent page reload)                 │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Set Adding = true (show spinner)                          │
│  Call onAdd("Review PRs")  (passed from App.jsx)          │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  API Call                                                   │
│  fetch('http://localhost:8000/tasks', {                   │
│    method: 'POST',                                         │
│    headers: {'Content-Type': 'application/json'},         │
│    body: JSON.stringify({title: "Review PRs"})            │
│  })                                                        │
│  .then(res => res.json())                                 │
│  .then(task => setTasks([task, ...tasks]))               │
│  .catch(err => setError(err.message))                    │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Backend Processes (see earlier diagram)                   │
│  Returns: Task object with subtasks                       │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Promise Resolves                                           │
│  task = {                                                   │
│    id: "uuid",                                             │
│    title: "Review PRs",                                    │
│    subtasks: [...],                                        │
│    completed: false                                        │
│  }                                                         │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  React State Updates                                        │
│  setTasks([newTask, ...oldTasks])                         │
│  setInput("")  (clear input)                              │
│  setAdding(false)  (hide spinner)                         │
└──────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│  Component Re-renders                                       │
│  ├─ TaskManager displays new task at top                  │
│  ├─ Task has fade-in animation                            │
│  ├─ Input field is now empty                              │
│  ├─ Add button no longer shows spinner                    │
│  └─ User sees all subtasks under task                     │
└──────────────────────────────────────────────────────────────┘
```

---

## React Component Lifecycle Example

```
TaskCard Component Lifecycle
(for a single task)

┌────────────────────────────────┐
│ Component Mounts               │
│ render() called first time     │
│ display: task completed = false│
│ button shows "Mark Complete"   │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ User Clicks "Mark Complete"    │
└────────────────────────────────┘
         │
         ├──► Play Confetti
         │    confetti({...})
         │
         └──► Call onComplete(id)
              (API call to backend)
         │
         ▼
┌────────────────────────────────┐
│ While API processing:          │
│ state.completing = true        │
│ button shows "Completing..."   │
│ spinner animating              │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ API Returns Successfully       │
│ task.completed = true          │
│ task.completed_at = "2026-05.."│
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Parent (App.jsx) Updates       │
│ setTasks(prev =>               │
│   prev.map(t =>                │
│     t.id === id ? updated : t  │
│   )                            │
│ )                              │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ TaskCard Props Update          │
│ task.completed = true (now!)   │
│ Component re-renders           │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Render with new props:         │
│ isDone = task.completed = true │
│ - Title has strikethrough      │
│ - Border is green (completed)  │
│ - Checkmark appears            │
│ - Complete button disappears   │
│ - Delete button still visible  │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Task moves in UI               │
│ From "In Progress" section     │
│ To "Completed Today" section   │
│ (both use same data, just      │
│  filtered differently)         │
└────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Component Unmounts             │
│ (when deleted or page closes)  │
└────────────────────────────────┘
```

---

**These diagrams show how data flows through DailyPulse from the user interface down to the database and back!**
