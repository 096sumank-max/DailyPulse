# DailyPulse Morning Briefing Routine

## Routine Configuration

**Routine ID:** `trig_017WvnvUHunKYRNyiKd7w9Qn`  
**Status:** ✅ Active  
**Created:** May 28, 2026  

## Schedule

- **Frequency:** Every weekday (Monday–Friday)
- **Time:** 9:00 AM Asia/Calcutta (UTC+5:30)
- **UTC Equivalent:** 3:30 AM UTC
- **Cron Expression:** `30 3 * * 1-5`
- **Next Run:** May 29, 2026 at 3:30 AM UTC

## What It Does

The remote agent performs the following steps each morning:

1. Clones the DailyPulse GitHub repository
2. Creates a `.env` file with API keys:
   - `GEMINI_API_KEY` (Google Generative AI)
   - `TAVILY_API_KEY` (Web search/news)
3. Starts the FastAPI backend server
4. Fetches today's morning briefing:
   - Inspirational quote
   - Focus tip for the day
   - Daily message
   - Web insight (from Tavily)
5. Retrieves all tasks and filters for incomplete items from yesterday
6. Displays a formatted terminal summary with:
   - Morning briefing section
   - Latest AI news summary
   - Incomplete tasks list

## Repository

**URL:** https://github.com/096sumank-max/DailyPulse.git  
**Branch:** main  

## Environment & Tools

- **Environment:** Anthropic Cloud (Default)
- **Model:** Claude Sonnet 4.6
- **Available Tools:** Bash, Read, Write, Edit, Glob, Grep

## API Keys

The following API keys are configured in the routine (stored securely):
- Gemini API Key: Configured
- Tavily API Key: Configured

These are embedded in the routine and will be written to `.env` each run.

## Manage Routine

**View & Edit:** https://claude.ai/code/routines/trig_017WvnvUHunKYRNyiKd7w9Qn

From this page you can:
- View past run outputs
- Edit the schedule or prompt
- Enable/disable the routine
- Delete the routine (not reversible)

## Output

Each run produces:
- Formatted morning briefing in the terminal
- List of incomplete tasks from previous days
- Any errors or issues encountered

Output is viewable on the routine management page after each execution.

## Notes

- Routine runs in an isolated cloud environment with a fresh clone
- Backend startup takes 3-5 seconds
- All API calls are to localhost (within the cloud session)
- If the backend fails to start, the routine displays an error message
