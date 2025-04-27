# Gemini 2.0 Flash API integration for summarization
import os
import requests

GEMINI_API_KEY = "AIzaSyAs9Yc8Z6etZ0ZfmMOu1sWFJCpeC1fw2g4"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"


def summarize_conversation(messages):
    """
    Summarize a list of messages using Gemini 2.0 Flash API.
    messages: list of dicts with 'sender' and 'text'
    Returns: summary string
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set!")
    prompt = """Create a comprehensive 'Executive Brief' of this startup planning conversation that includes:

1. 📋 OVERVIEW:
   - Summarize the startup concept in 2-3 sentences
   - Core value proposition
   - Primary target market

2. ✅ KEY DECISIONS MADE:
   - List the major decisions agreed upon by the team
   - Include any pivots or strategic shifts

3. 🎯 STRATEGIC PRIORITIES:
   - Rank the top 3-5 priorities based on the conversation
   - Include timing expectations if mentioned

4. 💰 BUSINESS MODEL INSIGHTS:
   - Revenue streams identified
   - Pricing strategy considerations
   - Customer acquisition approach

5. ⚡ RISKS & CHALLENGES DISCUSSED:
   - Technical obstacles
   - Market/competitive threats
   - Resource constraints

6. 💼 ROLE-SPECIFIC CONCERNS:
   - Product (PM): Product-market fit concerns
   - Technical (CTO): Implementation challenges
   - Financial (Investor): ROI and funding requirements
   - Marketing: Go-to-market hurdles
   - Leadership (CEO): Vision alignment issues

7. 🛣️ NEXT STEPS AGREED:
   - Immediate action items
   - Research needs
   - Follow-up discussions required

8. 🚀 MVP RECOMMENDATION:
   - Core features for initial release
   - Timeline considerations
   - Success metrics

FORMAT WITH CLEAR HEADINGS AND BULLET POINTS FOR EASY SCANNING.
BE THOROUGH BUT CONCISE, FOCUSING ON ACTIONABLE BUSINESS INTELLIGENCE.
USE PROFESSIONAL EXECUTIVE SUMMARY LANGUAGE.

Conversation transcript:
""" + "\n".join([f"{m['sender']}: {m['text']}" for m in messages])
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
    # Directly generate slides without asking for more details
    prompt = (
        "Generate a concise, investor-focused 7-slide pitch deck based on the following conversation between AI agents. "
        "Do not ask for additional details; use only the provided conversation. "
        "For each slide, use the format:\n"
        "Slide [number] - [Title]:\n"
        "- bullet point 1\n"
        "- bullet point 2\n\n"
        "Slide titles: Problem, Solution, Market, Business Model, Go-to-Market Plan, Technology, Roadmap, Team.\n\n"
        "Conversation:\n"
    ) + "\n".join([f"{m['sender']}: {m['text']}" for m in messages])
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


def create_brand_moodboard(idea, messages):
    """
    Generate a brand moodboard for a startup idea, including color palette,
    logo style, and taglines
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set!")
    
    prompt = f"""Create a startup brand moodboard for this idea: "{idea}"

Based on the conversation between the agents, generate:

1. 🎨 BRAND COLORS:
   - Suggest a primary, secondary, and accent color palette (with hex codes)
   - Briefly explain why these colors fit the brand personality

2. 🖼️ LOGO STYLE DIRECTION:
   - Recommend a logo style (minimalist, bold, playful, etc.)
   - Describe 2-3 key visual elements that would work well
   - Suggest an appropriate icon or symbol that represents the concept

3. 📢 POTENTIAL TAGLINES:
   - Create 3 alternative taglines that capture the value proposition
   - Each should be concise (5-8 words maximum)
   - Appeal to the target market identified in the conversation

4. 📝 BRAND VOICE:
   - Suggest the overall tone: formal/casual, technical/accessible, etc.
   - List 3-5 adjectives that should describe all communications

FORMAT THE RESPONSE WITH CLEAR HEADINGS, COLOR PREVIEWS, AND CONCISE DESCRIPTIONS.
FOCUS ON CREATING A COHESIVE BRAND IDENTITY THAT MATCHES THE STARTUP'S VISION AND TARGET MARKET.

Conversation context:
{"\n".join([f"{m['sender']}: {m['text']}" for m in messages])}
"""
    
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
        print("[DEBUG] Gemini API response for moodboard:", data)
        return data['candidates'][0]['content']['parts'][0]['text'] if data.get('candidates') else "No moodboard could be generated."
    except Exception as e:
        import traceback
        print("[ERROR] Gemini API call for moodboard failed:", traceback.format_exc())
        raise


def simulate_investor_qa(messages):
    """
    Simulate a 3-question mock investor Q&A based on the startup plan. Let agents answer as themselves.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set!")
    prompt = (
        "You are simulating a post-pitch investor Q&A for a startup.\n"
        "Based on the following conversation, generate 3 tough investor questions (one per slide):\n"
        "- How will you defend against bigger competitors?\n"
        "- What's your CAC vs LTV?\n"
        "- [A third question relevant to this startup]\n"
        "For each question, write the question, then simulate short, role-specific answers from the PM, CTO, and Investor agents.\n"
        "Format:\n"
        "Q: [question]\nPM: [answer]\nCTO: [answer]\nInvestor: [answer]\n"
        "Use only info from the transcript. If not enough info, have agents answer honestly or admit uncertainty.\n\n"
        "Startup transcript:\n"
        + "\n".join([f"{m['sender']}: {m['text']}" for m in messages])
    )
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    return data['candidates'][0]['content']['parts'][0]['text'] if data.get('candidates') else "No Q&A returned."


def generate_risk_map(messages):
    """
    Generate a risk heatmap/dashboard for the startup. Score Tech, Market, and Funding risk 0-10, with 1-2 lines of justification each.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set!")
    prompt = (
        "Based on the following startup transcript, rate the following risks from 0 (no risk) to 10 (extreme risk):\n"
        "- Tech Risk (CTO):\n"
        "- Market Risk (Marketer):\n"
        "- Funding Risk (Investor):\n"
        "For each, provide a 1-2 line justification.\n"
        "Format:\n"
        "Tech Risk: [score]/10 - [justification]\n"
        "Market Risk: [score]/10 - [justification]\n"
        "Funding Risk: [score]/10 - [justification]\n\n"
        "Transcript:\n"
        + "\n".join([f"{m['sender']}: {m['text']}" for m in messages])
    )
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    return data['candidates'][0]['content']['parts'][0]['text'] if data.get('candidates') else "No risk map returned."
