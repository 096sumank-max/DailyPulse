from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services import (
    get_or_create_briefing,
    get_tasks,
    create_task,
    complete_task,
    delete_task,
    generate_standup,
    generate_insights,
    generate_task_breakdown,
    get_latest_ai_news,
)

router = APIRouter()


class TaskRequest(BaseModel):
    title: str


class TaskBreakdownRequest(BaseModel):
    task_description: str


@router.get("/briefing")
async def briefing():
    """Get or generate today's morning briefing."""
    return await get_or_create_briefing()


@router.get("/tasks")
async def tasks():
    """Return all tasks."""
    return await get_tasks()


@router.post("/tasks", status_code=201)
async def add_task(request: TaskRequest):
    """Add a new task with AI-generated subtasks."""
    return await create_task(request.title)


@router.post("/tasks/breakdown")
async def task_breakdown(request: TaskBreakdownRequest):
    """Generate a detailed task breakdown with time estimates."""
    return await generate_task_breakdown(request.task_description)


@router.put("/tasks/{task_id}/complete")
async def mark_complete(task_id: str):
    """Mark a task as complete."""
    task = await complete_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/tasks/{task_id}", status_code=204)
async def remove_task(task_id: str):
    """Delete a task."""
    deleted = await delete_task(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")


@router.get("/standup")
async def standup():
    """Generate a standup from today's completed tasks."""
    return await generate_standup()


@router.get("/insights")
async def insights():
    """Generate insights from today's task patterns."""
    return await generate_insights()


@router.get("/news/ai")
async def ai_news():
    """Get latest AI news from Tavily."""
    return get_latest_ai_news()
