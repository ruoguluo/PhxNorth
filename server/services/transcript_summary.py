"""Generate AI summaries from session transcripts using LLM."""

import json
import os

import httpx

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_API_URL = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1")


def generate_summary(
    transcript_text: str,
    topic: str,
    mentor_name: str,
    mentee_name: str,
) -> dict:
    prompt = f"""You are analyzing a mentorship session transcript between {mentor_name} (mentor) and {mentee_name} (mentee). The session topic was: "{topic}".

Transcript:
{transcript_text[:8000]}

Generate a JSON object with these exact keys:
1. "key_points" - array of 3-5 key discussion points (strings)
2. "action_items" - array of objects with "task" (string) and "owner" ("mentor" or "mentee")
3. "follow_ups" - array of topics to discuss in the next session (strings)
4. "progress_notes" - a brief paragraph of observations about the mentee's progress (string)

Respond ONLY with the JSON object, no other text."""

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }
    body = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,
        "max_tokens": 1000,
    }

    try:
        with httpx.Client(timeout=30) as client:
            resp = client.post(f"{DEEPSEEK_API_URL}/chat/completions", headers=headers, json=body)
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            content = content.strip()
            if content.startswith("```"):
                content = content.split("\n", 1)[1]
                content = content.rsplit("```", 1)[0]
            return json.loads(content.strip())
    except Exception as e:
        return {
            "key_points": ["Summary generation failed"],
            "action_items": [],
            "follow_ups": [],
            "progress_notes": f"Error generating summary: {str(e)}",
        }
