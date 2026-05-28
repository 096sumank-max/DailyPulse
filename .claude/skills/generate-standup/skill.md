---
name: generate-standup
description: Generates a professional standup from today's DailyPulse tasks. Use before your daily standup meeting.
trigger: /generate-standup
effort: low
---

# Generate Standup

Creates a professional daily standup from your completed and upcoming tasks, with optional blockers.

```bash
#!/bin/bash
# Generate standup skill for DailyPulse

set -e

API="http://localhost:8000"

echo ""
echo "📝 Generating your standup..."
echo ""

# Fetch standup data
STANDUP=$(curl -s "$API/standup")

# Extract data from response
COMPLETED=$(echo "$STANDUP" | jq -r '.completed[]?' 2>/dev/null)
NEXT=$(echo "$STANDUP" | jq -r '.next[]?' 2>/dev/null)

# Function to format items with bullets
format_items() {
  local items="$1"
  if [ -z "$items" ]; then
    echo "  • None"
  else
    echo "$items" | sed 's/^/  • /'
  fi
}

# Display standup sections
echo "═══════════════════════════════════════════════════════"
echo "📋 Daily Standup"
echo "═══════════════════════════════════════════════════════"
echo ""

echo "✅ Yesterday / Today's Completed Work"
format_items "$COMPLETED"
echo ""

echo "🔨 What I'm Working On Next"
format_items "$NEXT"
echo ""

echo "🚧 Blockers"
echo "Do you have any blockers to mention? (press Enter if none)"
read -r BLOCKERS

# Store blockers for display
BLOCKERS_DISPLAY=$([ -z "$BLOCKERS" ] && echo "  • None" || echo "$BLOCKERS" | sed 's/^/  • /')

echo "$BLOCKERS_DISPLAY"
echo ""
echo "═══════════════════════════════════════════════════════"
echo ""

# Ask to copy to clipboard
read -p "Copy this to clipboard? (y/n) " COPY_TO_CLIPBOARD

if [ "$COPY_TO_CLIPBOARD" = "y" ] || [ "$COPY_TO_CLIPBOARD" = "Y" ]; then
  # Build the complete standup text
  STANDUP_TEXT=$(cat <<EOF
✅ Yesterday / Today's Completed Work
$(format_items "$COMPLETED")

🔨 What I'm Working On Next
$(format_items "$NEXT")

🚧 Blockers
$BLOCKERS_DISPLAY
EOF
)

  # Detect OS and use appropriate copy command
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "$STANDUP_TEXT" | pbcopy && echo "✅ Copied to clipboard!"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    command -v xclip >/dev/null 2>&1 && echo "$STANDUP_TEXT" | xclip -selection clipboard && echo "✅ Copied to clipboard!" || echo "❌ xclip not found. Install it to use clipboard copy."
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    echo "$STANDUP_TEXT" | clip && echo "✅ Copied to clipboard!"
  else
    echo "❌ Clipboard copy not supported on this OS"
  fi
else
  echo "Standup not copied."
fi

echo ""
```