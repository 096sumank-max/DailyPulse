# DailyPulse

DailyPulse is a personal AI productivity web app. Users get a morning briefing,
manage smart tasks (AI breaks tasks into subtasks), generate standups from
completed tasks, and view daily insights.

## Tech Stack

- **Backend:** Python FastAPI, runs on port 8000, data stored in backend/data/
  as JSON files (tasks.json, briefing.json). Use python-dotenv for env vars.
- **Frontend:** React with Vite, Tailwind CSS, runs on port 5173.
  Use fetch() for API calls to http://localhost:8000.
  No external state management — useState and useEffect only.
- **AI:** Gemini via google-generativeai SDK (model: gemini-2.0-flash).
  API key from GEMINI_API_KEY env var.

## Tailwind CSS

Check `frontend/package.json` for the installed Tailwind version and follow
that version's own official setup guide. Setup differs significantly between
major versions — do not assume any particular config file, directives, or
plugin registration pattern without checking first.

## Code Standards

- Python: type hints on all functions, docstrings on all public functions,
  black formatting, no bare except blocks
- React: functional components only, props typed with JSDoc,
  loading and error states on every API call
- File naming: snake_case for Python, PascalCase for React components

## Key Files

- backend/main.py — FastAPI route handlers (thin layer, calls services.py)
- backend/services.py — all business logic and AI calls
- backend/data/ — JSON storage (tasks.json, briefing.json)
- frontend/src/App.jsx — main React component
- frontend/src/components/ — React components directory
- frontend/vite.config.js — Vite config
- frontend/src/index.css — global styles

## Running the App

```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```