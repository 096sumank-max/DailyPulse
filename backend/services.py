import json
import os
import uuid
from datetime import datetime, date, timezone, timedelta
from pathlib import Path
from typing import Optional

from google import genai
from google.genai import errors as genai_errors
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
_MODEL = "gemini-2.5-flash"
_tavily_enabled = os.getenv("TAVILY_ENABLED", "false").lower() == "true"
_tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY")) if _tavily_enabled else None

DATA_DIR = Path(__file__).parent / "data"
TASKS_FILE = DATA_DIR / "tasks.json"
BRIEFING_FILE = DATA_DIR / "briefing.json"


def _read_tasks() -> list[dict]:
    """Read all tasks from the JSON store."""
    if not TASKS_FILE.exists():
        return []
    with open(TASKS_FILE) as f:
        return json.load(f)


def _write_tasks(tasks: list[dict]) -> None:
    """Persist tasks to the JSON store."""
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=2)


def _read_briefing() -> dict:
    """Read the stored briefing."""
    if not BRIEFING_FILE.exists():
        return {}
    with open(BRIEFING_FILE) as f:
        return json.load(f)


def _write_briefing(briefing: dict) -> None:
    """Persist the briefing to the JSON store."""
    with open(BRIEFING_FILE, "w") as f:
        json.dump(briefing, f, indent=2)


def _get_today_string() -> str:
    """Get today's date in Asia/Calcutta timezone as ISO string (YYYY-MM-DD)."""
    tz_offset = timezone(timedelta(hours=5, minutes=30))
    today = datetime.now(tz_offset).date()
    return today.isoformat()


def _strip_code_fence(text: str) -> str:
    """Remove markdown code fences that Gemini sometimes wraps around JSON."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        # Drop the opening fence line and the closing fence line
        inner = lines[1:-1] if lines[-1].strip() == "```" else lines[1:]
        text = "\n".join(inner).strip()
    return text


async def _call_gemini(prompt: str) -> str:
    """Call Gemini and return the response text."""
    try:
        response = await _client.aio.models.generate_content(
            model=_MODEL,
            contents=prompt,
        )
        return response.text
    except genai_errors.ClientError as e:
        if e.status == "RESOURCE_EXHAUSTED" or "429" in str(e):
            raise RuntimeError("Gemini quota exceeded — please wait a minute and try again.") from e
        raise


def _get_web_tip() -> Optional[str]:
    """Fetch a productivity tip from Tavily. Returns None if disabled or on error."""
    if not _tavily_enabled or not _tavily_client:
        return None

    try:
        tz_offset = timezone(timedelta(hours=5, minutes=30))
        today = datetime.now(tz_offset).strftime("%B %d, %Y")
        query = f"productivity tip for developers {today}"
        response = _tavily_client.search(query=query, max_results=1)

        if response and response.get("results"):
            return response["results"][0].get("content")
        return None
    except Exception:
        return None


async def get_or_create_briefing() -> dict:
    """Return today's briefing, generating it with Gemini if not yet cached."""
    today = _get_today_string()
    all_briefings = _read_briefing()

    if today in all_briefings:
        return all_briefings[today]

    prompt = (
        "Generate a morning briefing. Respond with ONLY valid JSON — no markdown, no extra text.\n"
        "Schema:\n"
        '{"quote": "inspiring motivational quote", '
        '"focus_tip": "one specific focus tip for the day", '
        '"message": "encouraging message under 50 words"}'
    )

    text = _strip_code_fence(await _call_gemini(prompt))

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        data = {
            "quote": "Every day is a new opportunity to grow.",
            "focus_tip": "Focus on one task at a time for maximum productivity.",
            "message": "You have everything you need to make today great. Take it one step at a time.",
        }

    web_tip = _get_web_tip()
    if web_tip:
        data["web_tip"] = web_tip

    entry = {"date": today, **data}
    all_briefings[today] = entry
    _write_briefing(all_briefings)
    return entry


async def get_tasks() -> list[dict]:
    """Return all tasks."""
    return _read_tasks()


async def create_task(title: str) -> dict:
    """Create a task and ask Gemini to generate 3-5 concrete subtasks."""
    prompt = (
        f'Break down this task into 3-5 concrete, actionable subtasks.\nTask: "{title}"\n'
        "Respond with ONLY a JSON array of strings — no markdown, no explanation.\n"
        'Example: ["subtask 1", "subtask 2", "subtask 3"]'
    )

    text = _strip_code_fence(await _call_gemini(prompt))

    try:
        subtasks = json.loads(text)
        if not isinstance(subtasks, list):
            raise ValueError("not a list")
        subtasks = [str(s) for s in subtasks]
    except (json.JSONDecodeError, ValueError):
        subtasks = ["Break this task down manually"]

    tz_offset = timezone(timedelta(hours=5, minutes=30))
    task: dict = {
        "id": str(uuid.uuid4()),
        "title": title,
        "subtasks": subtasks,
        "completed": False,
        "completed_at": None,
        "created_at": datetime.now(tz_offset).isoformat(),
    }

    tasks = _read_tasks()
    tasks.append(task)
    _write_tasks(tasks)
    return task


async def complete_task(task_id: str) -> Optional[dict]:
    """Mark a task complete and record the timestamp. Returns None if not found."""
    tasks = _read_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = True
            tz_offset = timezone(timedelta(hours=5, minutes=30))
            task["completed_at"] = datetime.now(tz_offset).isoformat()
            _write_tasks(tasks)
            return task
    return None


async def delete_task(task_id: str) -> bool:
    """Remove a task by id. Returns False if the id does not exist."""
    tasks = _read_tasks()
    filtered = [t for t in tasks if t["id"] != task_id]
    if len(filtered) == len(tasks):
        return False
    _write_tasks(filtered)
    return True


async def generate_task_breakdown(task_description: str) -> dict:
    """Generate a detailed task breakdown with time estimates for each subtask."""
    prompt = (
        f'Provide a detailed breakdown of this task into 4-6 concrete, actionable subtasks.\n'
        f'Task: "{task_description}"\n\n'
        'Respond with ONLY a JSON object — no markdown, no explanation.\n'
        'Schema: {{"subtasks": [{{"title": "string", "description": "string", "estimated_hours": number}}]}}\n'
        'Example: {{"subtasks": [{{"title": "Research APIs", "description": "Review REST API documentation", "estimated_hours": 1.5}}]}}'
    )

    text = _strip_code_fence(await _call_gemini(prompt))

    try:
        data = json.loads(text)
        if not isinstance(data, dict) or "subtasks" not in data:
            raise ValueError("invalid schema")
        return data
    except (json.JSONDecodeError, ValueError):
        return {
            "subtasks": [
                {
                    "title": "Break this task down manually",
                    "description": "Unable to generate AI breakdown. Please manually define the subtasks for this task.",
                    "estimated_hours": 2
                }
            ]
        }


async def generate_standup() -> dict:
    """Generate a professional standup from today's completed tasks."""
    today = _get_today_string()
    tasks = _read_tasks()

    completed_today = [
        t for t in tasks
        if t["completed"] and (t.get("completed_at") or "").startswith(today)
    ]

    if not completed_today:
        return {
            "standup": (
                "No tasks completed today yet. "
                "Complete some tasks to generate your standup!"
            )
        }

    task_list = "\n".join(f"- {t['title']}" for t in completed_today)
    prompt = (
        f"Write a professional standup update based on these completed tasks:\n{task_list}\n\n"
        "Include two short sections: what was accomplished and what is planned next. "
        "Keep it under 100 words and use a professional tone."
    )

    text = await _call_gemini(prompt)
    return {"standup": text.strip()}


async def generate_insights() -> dict:
    """Generate productivity insights from today's tasks."""
    today = _get_today_string()
    tasks = _read_tasks()

    today_tasks = [t for t in tasks if (t.get("created_at") or "").startswith(today)]

    if not today_tasks:
        return {
            "insights": "No tasks found for today. Add some tasks to unlock productivity insights!"
        }

    total = len(today_tasks)
    completed = sum(1 for t in today_tasks if t["completed"])
    task_summary = "\n".join(
        f"- {t['title']} ({'completed' if t['completed'] else 'pending'})"
        for t in today_tasks
    )

    prompt = (
        f"Analyze these tasks from today and give productivity insights:\n{task_summary}\n\n"
        f"Stats: {completed}/{total} tasks completed.\n"
        "Cover: completion rate, any patterns you notice, and 2-3 specific actionable suggestions. "
        "Keep it under 150 words."
    )

    text = await _call_gemini(prompt)
    return {"insights": text.strip()}


def get_latest_ai_news() -> dict:
    """Fetch latest AI news from Tavily."""
    if not _tavily_enabled or not _tavily_client:
        return {"news": [], "error": "Tavily not enabled"}

    try:
        response = _tavily_client.search(
            query="latest news artificial intelligence",
            max_results=5,
            include_answer=True
        )

        return {
            "query": response.get("query"),
            "summary": response.get("answer"),
            "news": [
                {
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "snippet": result.get("content", "")[:200],
                    "score": result.get("score")
                }
                for result in response.get("results", [])
            ]
        }
    except Exception as e:
        return {"news": [], "error": str(e)}
