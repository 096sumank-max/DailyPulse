---
name: morning-briefing
description: Generates and displays the DailyPulse morning briefing. Use at the start of every work session.
trigger: /morning-briefing
effort: low
---

# Morning Briefing

Fetches your daily briefing from DailyPulse and shows a task summary to help you focus.

```python
#!/usr/bin/env python3
"""Morning briefing skill for DailyPulse."""

import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from services import get_briefing, get_all_tasks


def display_briefing() -> None:
    """Fetch and display the morning briefing with task summary."""
    print("\n🌅 Fetching your morning briefing...\n")
    
    # Fetch briefing
    briefing_data = get_briefing()
    briefing_text = briefing_data.get("briefing", "") if briefing_data else ""
    
    # Display briefing if available
    if briefing_text:
        print("═" * 55)
        print("📋 Morning Briefing")
        print("═" * 55)
        print()
        print(briefing_text)
        print()
    
    # Fetch tasks
    tasks = get_all_tasks()
    
    # Calculate stats
    total = len(tasks)
    pending = sum(1 for t in tasks if not t.get("completed", False))
    today_completed = sum(1 for t in tasks if t.get("completed", False))
    
    # Get yesterday's completion count
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    yesterday_completed = sum(
        1 for t in tasks
        if t.get("completed", False)
        and t.get("completed_at", "").startswith(yesterday)
    )
    
    # Display stats
    print("═" * 55)
    print("📊 Task Summary")
    print("═" * 55)
    print()
    print(f"  {'Total tasks:':<25} {total}")
    print(f"  {'Pending:':<25} {pending}")
    print(f"  {'Completed today:':<25} {today_completed}")
    if yesterday_completed > 0:
        print(f"  {'Completed yesterday:':<25} {yesterday_completed}")
    print()
    
    # Suggest focus
    if pending > 0:
        print("🎯 Suggested Focus Areas")
        print("─" * 55)
        pending_tasks = [t for t in tasks if not t.get("completed", False)]
        for task in pending_tasks[:3]:
            print(f"  • {task.get('title', 'Untitled')}")
        print()
    
    print("═" * 55)
    print()


if __name__ == "__main__":
    display_briefing()
```