# DailyPulse Quick Reference Guide

**One-page cheat sheet for developers and users**

---

## 🎯 What is DailyPulse?

**Personal AI productivity app** that helps you:
- Get morning briefings (AI-generated quotes, tips, advice)
- Manage tasks (AI automatically breaks them into smaller steps)
- Generate summaries of your completed work
- Get productivity insights and analysis

---

## 🚀 Quick Start (5 minutes)

### Terminal 1: Start Backend
```bash
cd backend
pip install -r requirements.txt
export GEMINI_API_KEY="your_key_here"
export TAVILY_API_KEY="your_key_here"
uvicorn main:app --reload
# Backend ready at http://localhost:8000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173 in browser
```

---

## 📁 Key Files at a Glance

### Backend (Python)
| File | Purpose |
|------|---------|
| `main.py` | Routes (URLs you can call) |
| `services.py` | All the logic and AI calls |
| `data/tasks.json` | Your tasks storage |
| `data/briefing.json` | Cached briefings |
| `.env` | API keys (keep secret!) |

### Frontend (React)
| File | Purpose |
|------|---------|
| `App.jsx` | Main layout & state management |
| `components/TaskCard.jsx` | Individual task display |
| `components/TaskManager.jsx` | Task input & list |
| `components/StandupPanel.jsx` | Standup generator |
| `components/BriefingCard.jsx` | Morning briefing |
| `index.css` | Animations & styles |

---

## 🔌 Configuration Files

### `.claude/CLAUDE.md`
Project rules for AI assistant
- Tech stack definition
- Code standards
- Key file locations

### `.claude/settings.json`
Development automation
```json
{
  "hooks": {
    "PostToolUse": "Auto-format Python files",
    "Stop": "Print completion message"
  }
}
```

### `.mcp.json`
Third-party service connections
```json
{
  "mcpServers": {
    "tavily": "Web search (AI news)"
  }
}
```

### `MORNING_BRIEFING_ROUTINE.md`
Cloud automation schedule
- Runs: Every weekday at 9 AM (India time)
- Does: Generates & displays morning briefing
- Status: ✅ Active

---

## 🔄 API Endpoints

```
GET  /briefing           → Today's briefing (quote, tip, message)
GET  /tasks              → All your tasks
POST /tasks              → Create new task (AI breaks it down)
PUT  /tasks/{id}/complete → Mark task as done
DEL  /tasks/{id}         → Delete task
GET  /standup            → Generate professional standup
GET  /insights           → Get productivity insights
GET  /news/ai            → Latest AI news
```

---

## 🤖 AI Services Used

### Google Gemini
- **What:** Advanced AI language model
- **Use:** Task breakdown, briefing, standup, insights
- **Key:** `GEMINI_API_KEY` env var
- **Limit:** ~1 request/min on free tier

### Tavily Web Search
- **What:** Web search engine
- **Use:** Latest AI news, web tips
- **Key:** `TAVILY_API_KEY` env var
- **Enable:** Set `TAVILY_ENABLED=true`

---

## 📅 Scheduled Automation

### Morning Briefing Routine
```
Schedule:  Every weekday at 9:00 AM (India time)
Cron:      30 3 * * 1-5 (UTC equivalent)
Status:    ✅ Active
ID:        trig_017WvnvUHunKYRNyiKd7w9Qn
Manage:    https://claude.ai/code/routines/trig_017WvnvUHunKYRNyiKd7w9Qn
```

**What it does:**
1. Clone DailyPulse repo
2. Set up API keys in .env
3. Start backend server
4. Fetch today's briefing
5. Get incomplete tasks from yesterday
6. Display formatted summary

---

## 🎨 Features Checklist

| Feature | Status | File |
|---------|--------|------|
| ✅ Morning briefing | Working | BriefingCard.jsx |
| ✅ Smart task breakdown | Working | TaskCard.jsx, services.py |
| ✅ Confetti celebration | Working | TaskCard.jsx |
| ✅ Empty state message | Working | TaskManager.jsx |
| ✅ Standup generator | Working | StandupPanel.jsx |
| ✅ Insights & analysis | Working | InsightsPanel.jsx |
| ✅ AI news | Working | NewsPanel.jsx |
| ✅ Fade-out animations | Working | index.css |
| ✅ Mobile responsive | Working | Tailwind breakpoints |

---

## 🛠️ Development Hooks

### Hook 1: Auto-Format Python
```
Trigger: Python file saved
Action:  Black formatter runs automatically
Command: black filename.py
```

### Hook 2: Completion Message
```
Trigger: Claude finishes
Action:  Print completion message
Message: "[DailyPulse] Claude finished — review output above"
```

---

## ⏰ Timezone Handling

**Standard:** Asia/Calcutta (UTC+5:30)

**Why?** Ensures tasks created in India timezone are correctly dated/filtered

**Storage Format:**
```json
"completed_at": "2026-05-29T14:30:00+05:30"
                                     ^^^^^^
                        India timezone offset
```

---

## 📊 Data Storage Format

### Task Example
```json
{
  "id": "abc-123",
  "title": "Review PRs",
  "subtasks": [
    "Check out branches",
    "Run tests",
    "Leave comments",
    "Approve/request changes"
  ],
  "completed": false,
  "completed_at": null,
  "created_at": "2026-05-29T09:00:00+05:30"
}
```

### Briefing Example
```json
{
  "2026-05-29": {
    "quote": "The only way...",
    "focus_tip": "Focus on...",
    "message": "You have...",
    "web_tip": "Latest AI..."
  }
}
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Install requirements: `pip install -r requirements.txt` |
| "Cannot connect to backend" | Ensure backend runs on 8000; check `http://localhost:8000/tasks` |
| "No tasks appearing" | Check `backend/data/tasks.json` exists; restart backend |
| Styles look broken | Run `npm install` in frontend folder |
| Gemini API error 429 | Quota exceeded. Wait 1-2 min or upgrade API plan |
| Port 5173 in use | Kill old process or use: `npm run dev -- --port 5174` |
| Can't find .env file | Create it: `touch backend/.env` then add API keys |

---

## 🎯 Common Tasks

### Add a New API Endpoint

1. **Backend** (`main.py`):
   ```python
   @app.get("/my-endpoint")
   async def my_endpoint():
       return await services.my_function()
   ```

2. **Backend Logic** (`services.py`):
   ```python
   async def my_function():
       # Add your logic here
       return result
   ```

3. **Frontend** (`App.jsx`):
   ```javascript
   const [data, setData] = useState(null)
   useEffect(() => {
       fetch('http://localhost:8000/my-endpoint')
           .then(res => res.json())
           .then(setData)
   }, [])
   ```

### Format Python Code
```bash
# Manual formatting
black backend/

# Or just let the hook do it automatically when you save
```

### Update Task JSON Manually
```bash
# View all tasks
cat backend/data/tasks.json

# Edit directly (but be careful!)
nano backend/data/tasks.json
```

---

## 📚 Code Standards

### Python
```python
# ✅ Type hints required
def create_task(title: str) -> dict:
    """Docstring required on public functions."""
    pass

# ✅ Black formatting (auto-applied)
# ❌ No bare except blocks: except Exception as e
```

### React
```javascript
// ✅ Functional components only
export default function MyComponent({ prop }) {
  // ✅ JSDoc props typing
  const [state, setState] = useState(null)
  
  // ✅ PascalCase component names
  // ✅ Loading and error states on every API call
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
}

// ❌ No class components
// ❌ No external state management (no Redux, Context, etc.)
```

---

## 🔐 Environment Variables

Required in `backend/.env`:
```
GEMINI_API_KEY=sk-...           # Get from ai.google.dev
TAVILY_API_KEY=tvly-...         # Get from tavily.com
TAVILY_ENABLED=true             # Set to true to enable Tavily
```

**Never commit `.env` to git!** It's in `.gitignore` for security.

---

## 🚀 Deploy to Cloud

The Morning Briefing Routine already runs in Anthropic's cloud:

- **Routine ID:** `trig_017WvnvUHunKYRNyiKd7w9Qn`
- **Runs:** Every weekday 9 AM India time
- **Manage at:** https://claude.ai/code/routines

---

## 📖 For More Details

Full documentation: `PROJECT_DOCUMENTATION.md`

This file explains:
- Complete architecture
- All configuration files in detail
- Timezone handling deep dive
- Design decisions & why
- Advanced troubleshooting

---

**Last Updated:** May 29, 2026  
**Version:** 1.0  
**Author:** DailyPulse Development Team
