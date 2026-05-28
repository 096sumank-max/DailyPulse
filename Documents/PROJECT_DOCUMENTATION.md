# 📚 DailyPulse: Complete Project Documentation

*A comprehensive guide to understand DailyPulse technically and functionally*

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [How It Works (User Perspective)](#how-it-works-user-perspective)
3. [Technical Architecture](#technical-architecture)
4. [Configuration Files Explained](#configuration-files-explained)
5. [Automation & Scheduling](#automation--scheduling)
6. [Claude Agents](#claude-agents)
7. [Development Tools & Hooks](#development-tools--hooks)
8. [AI & Third-Party Services](#ai--third-party-services)
9. [File Structure](#file-structure)
10. [Running the Application](#running-the-application)
11. [Architecture Decisions](#architecture-decisions--why)
12. [Timezone Handling](#timezone-handling-technical-deep-dive)

---

## Project Overview

### What is DailyPulse?

**DailyPulse** is a personal AI-powered productivity web application designed to help you:
- **Start your day** with an inspiring morning briefing
- **Manage tasks intelligently** by breaking them into smaller, actionable subtasks using AI
- **Generate standups** automatically from completed tasks
- **Track insights** about your daily productivity and habits

Think of it as your personal productivity assistant that uses artificial intelligence (specifically Google's Gemini) to understand your work and provide intelligent insights.

### Key Features

| Feature | What It Does |
|---------|-------------|
| **Morning Briefing** | AI-generated quote, focus tip, daily message, and web insights delivered each morning |
| **Smart Task Manager** | Add tasks, AI automatically breaks them into subtasks to keep you focused |
| **Task Completion Tracking** | Mark tasks as complete with visual celebration (confetti animation) |
| **Standup Generator** | Automatically writes a professional standup summary from today's completed tasks |
| **Daily Insights** | AI analyzes your tasks and provides productivity suggestions |
| **AI News** | Shows latest AI news sourced from the web |

---

## How It Works (User Perspective)

### Daily Workflow

```
Morning
  ↓
📰 See Morning Briefing (quote, tip, message, web insights)
  ↓
📝 View/Add Tasks
  ↓
🤖 AI breaks each task into 3-5 subtasks
  ↓
✅ Mark subtasks and tasks as complete
  ↓
🎉 Confetti celebration when task is done
  ↓
📋 Generate Standup (what you accomplished today)
  ↓
📊 View Daily Insights (productivity analysis)
```

### Example: Adding a Task

**You:** "Review pull requests from the team"

**What Happens:**
1. Your browser sends the task to the backend
2. Backend asks Gemini AI: "Break this task into 3-5 concrete steps"
3. Gemini responds with subtasks:
   - Check out each branch locally
   - Run tests and verify functionality
   - Leave inline comments for suggestions
   - Approve or request changes
4. Browser displays the task with all subtasks
5. You check off subtasks as you complete them
6. When all subtasks are done, mark the whole task complete
7. Confetti animation celebrates your completion
8. This completed task is stored in your data

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR BROWSER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    React + Tailwind CSS Frontend (Port 5173)          │  │
│  │  - Displays tasks, briefing, insights                │  │
│  │  - Handles animations and UI interactions            │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────┬─────────────────────────────────────────────┘
                │
         HTTP Requests/Responses
         (fetch() API calls)
                │
┌───────────────▼─────────────────────────────────────────────┐
│            YOUR COMPUTER / SERVER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Python FastAPI Backend (Port 8000)                  │  │
│  │  - Routes HTTP requests                             │  │
│  │  - Manages all business logic                        │  │
│  │  - Stores data in JSON files                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                        │                                      │
│          ┌─────────────┼─────────────┐                      │
│          ▼             ▼             ▼                       │
│  ┌─────────────┐ ┌──────────┐ ┌──────────────┐            │
│  │ JSON Files  │ │ Gemini   │ │ Tavily       │            │
│  │ (tasks,     │ │ AI       │ │ (Web Search) │            │
│  │ briefing)   │ │ (Google) │ │              │            │
│  └─────────────┘ └──────────┘ └──────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

### How Data Flows

**Creating a Task:**
```
User types → Frontend sends → Backend receives → Calls Gemini AI
  ↓                           ↓                      ↓
"Review PRs"  ────→  /tasks  ────→  "Break this down"
                      POST              ↓
                                  Gemini returns subtasks
                                        ↓
                                  Store in tasks.json
                                        ↓
                                  Return to Frontend
                                        ↓
                                  Display in browser
```

---

## Configuration Files Explained

### 1. `.claude/CLAUDE.md` - Project Instructions

**What it is:** A "playbook" for Claude AI that explains how to work on this project

**Contains:**
- **Tech Stack Definition:** What technologies we're using (Python, React, Tailwind, Gemini)
- **Code Standards:** Rules for writing Python and React code
  - Python: Always use type hints, write docstrings, format with Black
  - React: Only use functional components, add loading states, use PascalCase names
- **Key Files Location:** Where to find important files in the project
- **Running Instructions:** Commands to start the backend and frontend

**Why it matters:** It ensures consistent code quality and helps AI assistants understand the project's conventions

---

### 2. `.claude/settings.json` - Development Hooks

**What it is:** Automation rules that trigger when certain actions happen in the editor

```json
{
  "hooks": {
    "PostToolUse": [...],  // Runs after files are written
    "Stop": [...]          // Runs when Claude finishes
  }
}
```

#### Hook 1: Auto-Format Python Files
```
When: Python file (.py) is written/edited
Action: Automatically run Black formatter on it
Why: Keeps all Python code consistently formatted
```

**Example:**
- You modify `backend/services.py`
- Claude writes the changes
- Hook automatically runs: `black backend/services.py`
- Code is now beautifully formatted

#### Hook 2: Completion Message
```
When: Claude finishes working
Action: Print a message to the terminal
Message: "[DailyPulse] Claude finished — review output above"
Why: Gives clear visual feedback that work is done
```

---

### 3. `.mcp.json` - External Service Connections

**What it is:** Configuration for connecting to Tavily (web search service)

```json
{
  "mcpServers": {
    "tavily": {
      "type": "http",
      "url": "https://mcp.tavily.com/mcp/"
    }
  }
}
```

**What Tavily does:**
- Searches the web for latest AI news
- Provides summaries and insights
- Used to generate "web tips" in your morning briefing

**Why we use it:** To give you curated, timely information about AI developments

---

## Automation & Scheduling

### Morning Briefing Routine

**What it is:** An automated task that runs every weekday morning to generate and display your briefing

**Configuration File:** `MORNING_BRIEFING_ROUTINE.md`

#### Schedule Details

| Property | Value |
|----------|-------|
| **Frequency** | Every weekday (Monday–Friday) |
| **Time** | 9:00 AM Asia/Calcutta (UTC+5:30) |
| **UTC Time** | 3:30 AM UTC |
| **Cron Expression** | `30 3 * * 1-5` |
| **Status** | ✅ Active |
| **Routine ID** | `trig_017WvnvUHunKYRNyiKd7w9Qn` |

**How Cron Works (Simple Explanation):**
```
Cron: 30 3 * * 1-5
      │  │ │ │ └─ Day of week: 1-5 = Monday to Friday
      │  │ │ └─── Month: * = every month
      │  │ └───── Day of month: * = every day
      │  └─────── Hour: 3 = 3 AM UTC
      └────────── Minute: 30 = 30 minutes past the hour
```

#### What Happens When It Runs

1. **Clone Repository** - Gets latest code from GitHub
2. **Create .env File** - Sets up API keys for Gemini and Tavily
3. **Start Backend** - Launches the FastAPI server
4. **Fetch Briefing** - Calls the API to generate today's briefing
5. **Get Tasks** - Retrieves all your tasks
6. **Filter Incomplete** - Finds tasks you didn't finish yesterday
7. **Display Summary** - Shows formatted output in terminal with:
   - Today's quote, tip, and message
   - Latest AI news summary
   - Incomplete tasks from yesterday

#### Output Example

```
═══════════════════════════════════════════════════════════
           DAILYPULSE MORNING BRIEFING
═══════════════════════════════════════════════════════════

Quote: "The only way to do great work is to love what you do." — Steve Jobs

Focus Tip: Break large problems into smaller, manageable pieces

Daily Message: You're capable of amazing things. Focus on progress, not perfection.

Web Insight: Latest AI breakthroughs in multi-modal models

═══════════════════════════════════════════════════════════
           INCOMPLETE TASKS FROM YESTERDAY
═══════════════════════════════════════════════════════════

❌ Fix login authentication bug
   - Reproduce the issue
   - Find root cause
   - Write tests

❌ Document API endpoints
   - Write examples
   - Add authentication notes
```

**Manage the Routine:**
- View/edit at: https://claude.ai/code/routines/trig_017WvnvUHunKYRNyiKd7w9Qn
- See past outputs
- Change schedule
- Enable/disable it

---

## Claude Agents

### What Are Agents?

**Agents** are specialized AI assistants designed for specific tasks. They have:
- Specific tools they can use (or are restricted from using)
- A particular model/version they run on
- Custom instructions for how to complete their job
- A specific color for easy identification

### Available Agents in DailyPulse

#### Task Breakdown Agent

**Location:** `.claude/agents/task-breakdown.md`

**Purpose:** Break down large, vague tasks into smaller, actionable subtasks

**Who Uses It:** When you have a big project and need structure

**Capabilities:**

| Aspect | Details |
|--------|---------|
| **Tools Allowed** | Read, Bash (read files, run commands) |
| **Tools Forbidden** | Write, Edit (read-only mode) |
| **AI Model** | Claude Haiku (faster, lighter) |
| **Color** | Green (for UI identification) |

**How It Works:**

```
Input:  "Set up a complete CI/CD pipeline for the project"

Output:
1. Create GitHub Actions workflow file (.github/workflows/ci.yml)
2. Configure test runners and build environment settings
3. Set up automated code formatting checks with Black
4. Configure deployment trigger to staging environment
5. Document deployment process and rollback procedures
```

**Rules for Task Breakdown:**

✅ Each subtask takes 2 hours max
✅ Starts with action verb (Write, Create, Test, Review, etc.)
✅ Subtasks are independent (don't rely on each other finishing first)
✅ Specific, not vague
✅ Returns just the list, no extra commentary

**Example Subtasks vs Bad Subtasks:**

| ✅ Good | ❌ Bad |
|--------|--------|
| "Set up database schema with migrations" | "Do database stuff" |
| "Write unit tests for auth module" | "Test the code" |
| "Deploy to production environment" | "Push changes" |
| "Document API endpoints with examples" | "Write docs" |

---

## Development Tools & Hooks

### What Are Hooks?

**Hooks** are automated actions that trigger at specific moments during development.

#### Hook 1: Auto-Format Python Code

```
Trigger: When a Python file is written/edited
Action: Run Black formatter automatically
Tool: jq + Python black
```

**In Plain English:**
```
IF you save a file that ends with .py
THEN automatically format it with Black (a Python code formatter)
SO all Python code looks consistent without you doing anything
```

**Example Timeline:**
```
1. You modify backend/services.py
2. Hit save
3. Claude writes the changes
4. Hook detects: "This is a .py file"
5. Hook runs: black backend/services.py
6. File is now beautifully formatted
7. You don't need to think about it
```

#### Hook 2: Completion Notification

```
Trigger: When Claude finishes working
Action: Print a message to the terminal
Message: "[DailyPulse] Claude finished — review output above"
```

**In Plain English:**
```
WHEN Claude is done working
PRINT a message to confirm it's done
SO you know when to look at the results
```

---

## AI & Third-Party Services

### 1. Google Gemini API

**What it is:** An advanced AI model from Google that understands language and can generate text

**What We Use It For:**

| Task | Example |
|------|---------|
| **Task Breakdown** | "Review PRs" → 4 subtasks |
| **Morning Briefing** | Generate daily quote, tip, message |
| **Standup Generation** | Convert task list → professional summary |
| **Productivity Insights** | Analyze tasks → provide suggestions |

**How It's Called:**
```python
# Backend code example
response = await gemini.generate(
    prompt="Break this task into 3-5 steps: Review pull requests"
)
subtasks = parse_json(response)  # Extract list of subtasks
```

**API Key:** Stored in `backend/.env` file as `GEMINI_API_KEY`

**Rate Limits:**
- Free tier: Limited requests per minute
- If you hit "429 Too Many Requests" error: Wait a few minutes and try again
- Upgrade to paid tier for higher limits

### 2. Tavily Web Search API

**What it is:** A specialized search engine for finding recent information

**What We Use It For:**
- Fetch latest AI news articles
- Generate "web tips" for morning briefing
- Search for productivity tips based on current date

**Configuration:** In `.mcp.json` file

**API Key:** Stored in `backend/.env` as `TAVILY_API_KEY`

**Example Search:**
```python
results = tavily.search(
    query="latest news artificial intelligence",
    max_results=5
)
# Returns: 5 latest AI news articles with summaries
```

---

## File Structure

### Backend (Python/FastAPI)

```
backend/
├── main.py                 # Entry point - defines all API routes
├── services.py             # All business logic and AI calls
├── requirements.txt        # Python dependencies
├── .env                    # API keys (secret - not in git)
└── data/
    ├── tasks.json         # Stores all your tasks
    └── briefing.json      # Caches morning briefings
```

#### Key Backend Files Explained

**`main.py` - The API Routes**

This file defines all the "endpoints" (URLs) your frontend can call:

```python
GET    /tasks              # Fetch all tasks
POST   /tasks              # Create a new task
PUT    /tasks/{id}/complete  # Mark task as complete
DELETE /tasks/{id}         # Delete a task

GET    /briefing           # Get morning briefing
GET    /standup            # Generate standup summary
GET    /insights           # Generate productivity insights
GET    /news/ai            # Get latest AI news
```

**`services.py` - The Logic**

This file contains:
- How to read/write JSON files
- How to call Gemini API
- How to search the web with Tavily
- Timezone handling (converts UTC to Asia/Calcutta time)
- All business logic

**`data/tasks.json` - Your Task Storage**

Example structure:
```json
[
  {
    "id": "abc123",
    "title": "Review pull requests",
    "subtasks": [
      "Check out each branch locally",
      "Run tests and verify functionality",
      "Leave inline comments"
    ],
    "completed": false,
    "completed_at": null,
    "created_at": "2026-05-29T09:30:00+05:30"
  }
]
```

**`data/briefing.json` - Cached Briefings**

Stores one briefing per day so we don't call Gemini multiple times:
```json
{
  "2026-05-29": {
    "date": "2026-05-29",
    "quote": "The only way...",
    "focus_tip": "Focus on...",
    "message": "You have...",
    "web_tip": "Latest AI..."
  }
}
```

### Frontend (React/JavaScript)

```
frontend/
├── src/
│   ├── App.jsx             # Main React component
│   ├── App.css             # Styling
│   ├── index.css           # Global styles + animations
│   ├── components/
│   │   ├── Header.jsx      # Top navigation bar
│   │   ├── TaskManager.jsx # Task input and list
│   │   ├── TaskCard.jsx    # Individual task display
│   │   ├── StandupPanel.jsx # Standup generator
│   │   ├── InsightsPanel.jsx # Insights display
│   │   ├── BriefingCard.jsx # Morning briefing
│   │   └── NewsPanel.jsx   # AI news display
│   └── main.jsx            # React entry point
├── package.json            # Node.js dependencies
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── index.html              # HTML template
```

#### Key Frontend Files Explained

**`App.jsx` - The Main Component**

Manages:
- Global state (tasks, briefing, news)
- API calls (fetch data from backend)
- Date calculations (what's "today"?)
- Layout (arranging all components)

**`components/TaskCard.jsx` - Individual Task**

Handles:
- Displaying task title and subtasks
- Checkbox interactions
- Marking tasks complete
- **Confetti animation** (celebrate when done!)
- Delete button

**`components/TaskManager.jsx` - Task Input & List**

Shows:
- Input field to add tasks
- All in-progress tasks
- All completed-today tasks (collapsible)
- Empty state message with icon

**`index.css` - Animations**

Defines animations used throughout the app:
```css
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.animate-fade-out {
  animation: fadeOut 1.5s ease-out;
  animation-delay: 1.6s;
}
```

Used for:
- "Copied!" message that fades out
- Smooth task appearance
- Other visual effects

---

## Running the Application

### Prerequisites

1. **Python 3.10+** installed
2. **Node.js 18+** and npm installed
3. **API Keys:**
   - Google Gemini API key (get free at https://ai.google.dev)
   - Tavily API key (optional, get at https://tavily.com)

### Setup Steps

#### 1. Backend Setup

```bash
cd backend

# Create .env file with your API keys
echo "GEMINI_API_KEY=your_key_here" > .env
echo "TAVILY_API_KEY=your_key_here" >> .env
echo "TAVILY_ENABLED=true" >> .env

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
# Server runs at: http://localhost:8000
```

#### 2. Frontend Setup (in another terminal)

```bash
cd frontend

# Install Node dependencies
npm install

# Start the frontend dev server
npm run dev
# App opens at: http://localhost:5173
```

#### 3. Test It Out

1. Open http://localhost:5173 in your browser
2. You should see the morning briefing (or loading state)
3. Try adding a task: "Review pull requests from the team"
4. Watch as AI breaks it into subtasks
5. Click checkboxes to mark subtasks complete
6. Click "Mark Complete" to finish the task
7. See confetti animation celebrate! 🎉
8. View the standup and insights

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot connect to backend" | Make sure backend is running on port 8000 |
| "Gemini API error 429" | Too many requests. Wait 1-2 minutes and retry. Or upgrade API plan |
| "No tasks showing" | Check that `backend/data/tasks.json` exists and backend is running |
| "Styles look broken" | Run `npm install` in frontend folder |
| "Port already in use" | Kill existing process or use different port with `--port 8001` |

---

## Architecture Decisions & Why

### 1. Why JSON Files Instead of a Database?

**Decision:** Store data in JSON files instead of using a database like PostgreSQL

**Why:**
- ✅ Simple - no database server to manage
- ✅ Easy to inspect - just open the file
- ✅ Fast enough for personal use
- ✅ No dependencies to install
- ❌ Trade-off: Can't handle millions of users

**For this project:** Perfect choice (it's personal productivity)

### 2. Why React + Vite (Not Other Frameworks)?

**React:**
- ✅ Component-based (reusable pieces)
- ✅ Hooks API for state management
- ✅ Large ecosystem
- ✅ Gentle learning curve

**Vite (instead of Create React App):**
- ✅ Much faster development
- ✅ Faster hot module reloading
- ✅ Smaller bundle sizes

### 3. Why Tailwind CSS (Not CSS-in-JS)?

**Tailwind:**
- ✅ Utility-first (build designs quickly)
- ✅ Consistent spacing and colors
- ✅ Responsive design easy (sm:, lg: prefixes)
- ✅ Dark mode support built-in

### 4. Why FastAPI (Not Express.js or Django)?

**FastAPI:**
- ✅ Modern Python framework (async/await)
- ✅ Automatic API documentation
- ✅ Fast performance
- ✅ Easy request validation
- ✅ Great for AI integrations

---

## Timezone Handling (Technical Deep Dive)

### The Problem

Your tasks are created and completed at different times. We need to know:
- What's "today"? (depends on your timezone)
- Which tasks were completed "today"?

**Example:**
- You're in India (UTC+5:30)
- You complete a task at 2 PM India time
- Server might think it's still "yesterday" (in UTC)
- Task doesn't show in today's standup

### The Solution

**Standardized on Asia/Calcutta timezone (UTC+5:30)**

**Backend Code:**
```python
from datetime import datetime, timezone, timedelta

# Create a timezone object for Asia/Calcutta
tz_offset = timezone(timedelta(hours=5, minutes=30))

# Get today's date in that timezone
today = datetime.now(tz_offset).date()  # Not UTC!
```

**Frontend Code:**
```javascript
const d = new Date()
const dateLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
return dateLocal.toISOString().slice(0, 10)  // YYYY-MM-DD
```

**Stored Format:**
```json
"completed_at": "2026-05-29T14:30:00+05:30"
                                     ^^^^^^
                        Timezone offset (India time)
```

---

## Summary

DailyPulse is a productivity tool with three layers:

### Layer 1: Frontend (What You See)
- React components displaying tasks, briefing, insights
- Tailwind CSS for beautiful styling
- Confetti animations for celebration
- Responsive design (works on mobile too)

### Layer 2: Backend (What Does the Work)
- FastAPI server receiving requests
- Calls Gemini AI for task breakdowns and insights
- Calls Tavily for latest AI news
- Stores everything in JSON files
- Handles timezone conversion

### Layer 3: Automation (Background Work)
- Cloud routine runs every weekday at 9 AM
- Automatically generates and displays morning briefing
- Shows incomplete tasks from yesterday
- Uses hooks to auto-format code

### Integration Points
- **Gemini API:** For all AI-powered features
- **Tavily API:** For web search and news
- **GitHub Routine:** Scheduled automation
- **Cloud Environment:** Where routine runs

---

## Next Steps / Getting Started

1. **Start the backend:** `cd backend && uvicorn main:app --reload`
2. **Start the frontend:** `cd frontend && npm run dev`
3. **Open the app:** http://localhost:5173
4. **Add your first task** and watch AI break it down
5. **Complete a task** and see the confetti! 🎉

---

**Happy Productivity! 🚀**

*Last Updated: May 29, 2026*
