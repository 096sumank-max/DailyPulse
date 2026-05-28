#!/usr/bin/env python3
"""
Tavily Explorer - Fetch latest news, quotes, and insights from the web.
"""

import os
import json
from datetime import date
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
if not TAVILY_API_KEY:
    raise ValueError("TAVILY_API_KEY not set in environment")

client = TavilyClient(api_key=TAVILY_API_KEY)


def fetch_latest_news(topic: str = "technology", max_results: int = 5) -> dict:
    """Fetch latest news for a given topic."""
    print(f"\n📰 Fetching latest {topic} news...")
    try:
        response = client.search(
            query=f"latest news {topic}",
            max_results=max_results,
            include_answer=True
        )
        return {
            "topic": topic,
            "query": response.get("query"),
            "summary": response.get("answer"),
            "articles": [
                {
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "snippet": result.get("content")[:200] + "..." if result.get("content") else None,
                    "relevance_score": result.get("score")
                }
                for result in response.get("results", [])
            ]
        }
    except Exception as e:
        return {"error": str(e)}


def fetch_quotes(topic: str = "success", max_results: int = 5) -> dict:
    """Fetch inspiring quotes related to a topic."""
    print(f"\n✨ Fetching {topic} quotes...")
    try:
        response = client.search(
            query=f"inspiring quotes about {topic}",
            max_results=max_results,
            include_answer=True
        )
        return {
            "topic": topic,
            "query": response.get("query"),
            "summary": response.get("answer"),
            "sources": [
                {
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "content": result.get("content")[:300] + "..." if result.get("content") else None,
                }
                for result in response.get("results", [])
            ]
        }
    except Exception as e:
        return {"error": str(e)}


def fetch_productivity_tips() -> dict:
    """Fetch productivity tips for developers."""
    print("\n⚡ Fetching productivity tips for developers...")
    try:
        response = client.search(
            query="productivity tips for developers 2026",
            max_results=5,
            include_answer=True
        )
        return {
            "category": "Productivity Tips",
            "query": response.get("query"),
            "answer": response.get("answer"),
            "tips": [
                {
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "excerpt": result.get("content")[:250] + "..." if result.get("content") else None,
                    "score": result.get("score")
                }
                for result in response.get("results", [])
            ]
        }
    except Exception as e:
        return {"error": str(e)}


def fetch_trending_topics() -> dict:
    """Fetch trending topics and discussions."""
    print("\n🔥 Fetching trending topics...")
    try:
        response = client.search(
            query="trending topics today",
            max_results=6,
            include_answer=True
        )
        return {
            "category": "Trending Today",
            "summary": response.get("answer"),
            "trending": [
                {
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "description": result.get("content")[:200] + "..." if result.get("content") else None,
                }
                for result in response.get("results", [])
            ]
        }
    except Exception as e:
        return {"error": str(e)}


def fetch_industry_insights(industry: str = "AI and machine learning") -> dict:
    """Fetch latest insights from a specific industry."""
    print(f"\n🏆 Fetching {industry} insights...")
    try:
        response = client.search(
            query=f"latest insights and trends {industry} 2026",
            max_results=5,
            include_answer=True
        )
        return {
            "industry": industry,
            "query": response.get("query"),
            "key_insights": response.get("answer"),
            "articles": [
                {
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "content": result.get("content")[:250] + "..." if result.get("content") else None,
                }
                for result in response.get("results", [])
            ]
        }
    except Exception as e:
        return {"error": str(e)}


def fetch_learning_resources(topic: str = "Python") -> dict:
    """Fetch learning resources for a topic."""
    print(f"\n📚 Fetching {topic} learning resources...")
    try:
        response = client.search(
            query=f"best tutorials and courses to learn {topic}",
            max_results=5,
            include_answer=True
        )
        return {
            "topic": topic,
            "recommendations": response.get("answer"),
            "resources": [
                {
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "description": result.get("content")[:250] + "..." if result.get("content") else None,
                }
                for result in response.get("results", [])
            ]
        }
    except Exception as e:
        return {"error": str(e)}


def generate_daily_briefing() -> dict:
    """Generate a comprehensive daily briefing."""
    print("\n" + "="*60)
    print("🌅 GENERATING DAILY BRIEFING")
    print("="*60)

    briefing = {
        "date": date.today().isoformat(),
        "sections": {}
    }

    # Fetch different sections
    briefing["sections"]["news"] = fetch_latest_news("technology", max_results=3)
    briefing["sections"]["quotes"] = fetch_quotes("leadership", max_results=3)
    briefing["sections"]["productivity"] = fetch_productivity_tips()
    briefing["sections"]["trending"] = fetch_trending_topics()

    return briefing


def display_result(data: dict, title: str = None) -> None:
    """Pretty print results."""
    if title:
        print(f"\n{'='*60}")
        print(f"  {title}")
        print(f"{'='*60}")

    if "error" in data:
        print(f"❌ Error: {data['error']}")
    else:
        print(json.dumps(data, indent=2))


def main():
    """Main function with CLI options."""
    import sys

    if len(sys.argv) > 1:
        command = sys.argv[1]
    else:
        command = "briefing"

    if command == "news":
        topic = sys.argv[2] if len(sys.argv) > 2 else "technology"
        result = fetch_latest_news(topic)
        display_result(result, f"Latest {topic.title()} News")

    elif command == "quotes":
        topic = sys.argv[2] if len(sys.argv) > 2 else "success"
        result = fetch_quotes(topic)
        display_result(result, f"{topic.title()} Quotes")

    elif command == "productivity":
        result = fetch_productivity_tips()
        display_result(result, "Productivity Tips")

    elif command == "trending":
        result = fetch_trending_topics()
        display_result(result, "Trending Topics")

    elif command == "insights":
        industry = sys.argv[2] if len(sys.argv) > 2 else "AI and machine learning"
        result = fetch_industry_insights(industry)
        display_result(result, f"{industry.title()} Insights")

    elif command == "learn":
        topic = sys.argv[2] if len(sys.argv) > 2 else "Python"
        result = fetch_learning_resources(topic)
        display_result(result, f"Learning {topic}")

    elif command == "briefing":
        result = generate_daily_briefing()
        display_result(result, "Daily Briefing")

        # Save to file
        with open("daily_briefing.json", "w") as f:
            json.dump(result, f, indent=2)
        print(f"\n✅ Briefing saved to daily_briefing.json")

    else:
        print("""
Usage: python tavily_explorer.py [command] [options]

Commands:
  briefing              Generate a comprehensive daily briefing (default)
  news [topic]         Fetch latest news (default: technology)
  quotes [topic]       Fetch quotes (default: success)
  productivity         Fetch productivity tips
  trending             Fetch trending topics
  insights [industry]  Fetch industry insights (default: AI and machine learning)
  learn [topic]        Fetch learning resources (default: Python)

Examples:
  python tavily_explorer.py briefing
  python tavily_explorer.py news ai
  python tavily_explorer.py quotes motivation
  python tavily_explorer.py insights "web development"
  python tavily_explorer.py learn "JavaScript"
        """)


if __name__ == "__main__":
    main()
