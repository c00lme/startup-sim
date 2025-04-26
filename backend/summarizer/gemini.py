# Gemini 2.0 Flash API integration for summarization
import os
import requests

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"


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
    params = {"key": GEMINI_API_KEY}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    response = requests.post(GEMINI_API_URL, headers=headers, params=params, json=payload)
    response.raise_for_status()
    data = response.json()
    # Extract summary from Gemini response
    return data['candidates'][0]['content']['parts'][0]['text'] if data.get('candidates') else "No summary returned."
