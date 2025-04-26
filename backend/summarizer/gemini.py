# Gemini 2.0 Flash API integration for summarization
import os
import requests

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"


def summarize_conversation(messages):
    """
    Summarize a list of messages using Gemini 2.0 Flash API.
    messages: list of dicts with 'sender' and 'text'
    Returns: summary string
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set!")
    prompt = "Summarize this startup planning conversation and extract key takeaways, SWOT, MVP suggestion, role-specific concerns, and final team decision.\n" + \
        "\n".join([f"{m['sender']}: {m['text']}" for m in messages])
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    # Extract summary from Gemini response
    return data['candidates'][0]['content']['parts'][0]['text'] if data.get('candidates') else "No summary returned."


def create_pitch_deck(messages):
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set!")
    prompt = (
        "Create a startup pitch deck based on the agents' outputs.\n"
        "Break it into 7-8 slides: Problem, Solution, Market, Business Model, Go-to-Market Plan, Technology, Roadmap, and Team.\n"
        "Each slide should be 3-5 sentences max.\n"
        "Write clearly and directly like a real founder pitching investors — no fluff, no marketing jargon.\n"
        "The tone should feel confident but grounded.\n"
        "Focus on substance, not fancy words.\n\n"
        "Here is the conversation:\n"
        + "\n".join([f"{m['sender']}: {m['text']}" for m in messages])
    )
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    try:
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        print("[DEBUG] Gemini API response:", data)
        return data['candidates'][0]['content']['parts'][0]['text'] if data.get('candidates') else "No pitch deck returned."
    except Exception as e:
        import traceback
        print("[ERROR] Gemini API call failed:", traceback.format_exc())
        raise
