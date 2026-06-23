import json
from google import genai
from config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

SYSTEM_PROMPT = """You are an expert code reviewer and static analysis engine.
Analyze the provided code and return a JSON response with this exact structure:

{
  "summary": "Brief 2-3 sentence overview of the code quality",
  "score": <integer 0-100 representing overall code quality>,
  "issues": [
    {
      "severity": "critical" | "warning" | "info",
      "category": "Bug" | "Security" | "Performance" | "Style" | "Logic" | "Best Practice",
      "line_number": <integer or null>,
      "title": "Short issue title",
      "description": "Detailed explanation of the issue",
      "suggestion": "How to fix it"
    }
  ]
}

Severity guidelines:
- critical: bugs, security vulnerabilities, logic errors that cause failures
- warning: performance issues, deprecated patterns, potential bugs
- info: style suggestions, best practices, minor improvements

Return ONLY valid JSON. No markdown, no text outside the JSON."""

def analyze_code(language: str, code: str) -> dict:
    """Send code to Gemini and return structured review results."""

    user_prompt = f"Language: {language}\n\nCode:\n```{language}\n{code}\n```"

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"{SYSTEM_PROMPT}\n\n{user_prompt}"
    )

    raw = response.text.strip()

    # Remove markdown fences if Gemini adds them
    if raw.startswith("```json"):
        raw = raw.replace("```json", "", 1)
    if raw.startswith("```"):
        raw = raw.replace("```", "", 1)
    if raw.endswith("```"):
        raw = raw[:-3]

    result = json.loads(raw.strip())

    return {
        "summary": result.get("summary", "No summary provided."),
        "score": max(0, min(100, int(result.get("score", 50)))),
        "issues": result.get("issues", []),
    }