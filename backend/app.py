from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
from agents.agent_factory import create_agents_for_session
from summarizer.gemini import summarize_conversation, create_pitch_deck, create_brand_moodboard, simulate_investor_qa, generate_risk_map
from report.pdf_generator import generate_pdf_report
import requests
from threading import Lock

load_dotenv()

UAGENTS_API_KEY = os.getenv('UAGENTS_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, allow_headers="*", methods=["GET", "POST", "OPTIONS"])

# --- AGENT COMMENT FEED ---
agent_comments = []
agent_comments_lock = Lock()

@app.route('/')
def index():
    return 'Startup Plan Simulator Backend API'

@app.route('/api/keys-check', methods=['GET'])
def keys_check():
    # For debugging only: do not expose in production!
    return jsonify({
        'uagents_api_key_loaded': bool(UAGENTS_API_KEY),
        'gemini_api_key_loaded': bool(GEMINI_API_KEY)
    })

@app.route('/api/start-session', methods=['POST'])
def start_session():
    data = request.json
    agent_configs = data.get('agents', [])
    agents = create_agents_for_session(agent_configs)
    print(f"[DEBUG] Created {len(agents)} agents for session.")
    # In a real implementation, you would store the session and agent state
    return jsonify({'session_id': 'stub-session-id', 'status': 'started', 'agents': agents})

@app.route('/api/agent-message', methods=['POST'])
def agent_message():
    data = request.get_json(force=True)
    print("[DEBUG] agent_message payload:", data)
    sender = data.get('sender') or 'user'
    recipient = data.get('recipient') or data.get('agent')
    text = data.get('text') or data.get('message')
    print(f"[DEBUG] sender={sender}, recipient={recipient}, text={text}")
    if not recipient or not text:
        print("[DEBUG] Missing required fields in agent_message")
        return jsonify({'error': 'recipient and text required', 'payload': data}), 400

    # Map agent names to ports (must match run_agents.py logic)
    agent_ports = {
        'PM-neutral': 8000,
        'CTO-cautious': 8001,
        'Investor-skeptical': 8002,
        'Marketer-optimistic': 8003,
        'CEO-supportive': 8004,
    }

    # Start the roundtable by sending to the first agent
    roundtable = []
    current_sender = sender
    current_message = text
    visited = set()
    agent_order = [recipient]
    # Build order: recipient, then round robin through all agents (excluding recipient)
    for name in agent_ports:
        if name != recipient:
            agent_order.append(name)

    for agent_name in agent_order:
        port = agent_ports.get(agent_name)
        if port is None:
            continue
        endpoint = f'http://127.0.0.1:{port}/submit'
        payload = {"message": current_message}
        try:
            resp = requests.post(endpoint, json=payload, timeout=30)
            resp.raise_for_status()
            agent_reply = resp.json().get('message', '')
            roundtable.append({'from': agent_name, 'reply': agent_reply})
            # The next agent gets the previous agent's reply
            current_message = agent_reply
            current_sender = agent_name
        except Exception as e:
            print(f"[DEBUG] Error contacting agent {agent_name}: {e}")
            roundtable.append({'from': agent_name, 'reply': f'[Error: {e}]'})
            # Stop the roundtable if an agent fails
            break

    return jsonify({'replies': roundtable})

@app.route('/api/agent-comment', methods=['POST'])
def agent_comment():
    data = request.json
    # Optionally add a timestamp here
    with agent_comments_lock:
        agent_comments.append(data)
    return jsonify({"status": "ok"})

@app.route('/api/conversation-feed', methods=['GET'])
def conversation_feed():
    with agent_comments_lock:
        return jsonify({"comments": agent_comments})

@app.route('/api/complete-session', methods=['POST'])
def complete_session():
    data = request.json
    messages = data.get('messages', [])
    # Use Gemini to summarize the conversation
    try:
        summary = summarize_conversation(messages)
    except Exception as e:
        summary = f"Gemini summarization failed: {str(e)}"
    # Generate PDF report
    pdf_path = generate_pdf_report(summary)
    # For demo, serve the PDF directly (in production, use secure static hosting)
    return jsonify({'report_url': '/api/download-report', 'summary': summary})

@app.route('/api/pitch-deck', methods=['POST'])
def pitch_deck():
    data = request.json
    messages = data.get('messages', [])
    try:
        deck = create_pitch_deck(messages)
        return jsonify({'pitch_deck': deck})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/brand-moodboard', methods=['POST'])
def brand_moodboard():
    """Generate a brand moodboard for the startup idea"""
    data = request.json
    idea = data.get('idea', '')
    messages = data.get('messages', [])
    
    try:
        moodboard = create_brand_moodboard(idea, messages)
        return jsonify({'moodboard': moodboard})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-report', methods=['GET'])
def download_report():
    # Always returns the latest generated report
    return send_file('business_report.pdf', as_attachment=True)

@app.route('/api/simulate-conflict', methods=['POST'])
def simulate_conflict():
    """Simulate a co-founder conflict and let the user decide the outcome"""
    data = request.json
    session_id = data.get('sessionId')
    idea = data.get('idea', '')
    
    # Generate conflict between PM and CTO about MVP scope
    conflict_types = [
        {
            "title": "MVP Scope Conflict",
            "pm_position": "We should focus on a minimal set of core features to get to market faster.",
            "cto_position": "We need to build a more robust technical foundation to avoid rewriting later.",
            "stakes": "Timeline vs. Technical Debt"
        },
        {
            "title": "Market Focus Conflict",
            "pm_position": "We should target enterprise clients first - they have bigger budgets.",
            "cto_position": "We should start with consumers - the sales cycle is faster and we can iterate quickly.",
            "stakes": "Sales Cycle vs. Iteration Speed"
        },
        {
            "title": "Technology Stack Conflict",
            "pm_position": "Let's use more established technologies our clients will trust.",
            "cto_position": "We should use cutting-edge tech that will give us a competitive advantage.",
            "stakes": "Client Trust vs. Technical Edge"
        }
    ]
    
    # Select a random conflict type
    import random
    conflict = random.choice(conflict_types)
    
    return jsonify({
        "conflict": conflict,
        "session_id": session_id
    })

@app.route('/api/resolve-conflict', methods=['POST'])
def resolve_conflict():
    """Process the user's decision on the co-founder conflict"""
    data = request.json
    winner = data.get('winner')  # 'pm' or 'cto'
    conflict_type = data.get('conflict_type')
    session_id = data.get('sessionId')
    
    # Generate a modified roadmap based on the decision
    if winner == 'pm':
        if conflict_type == 'MVP Scope Conflict':
            roadmap_adjustment = "Roadmap adjusted: Faster launch timeline with core features only. Technical debt to be addressed in v2."
        elif conflict_type == 'Market Focus Conflict':
            roadmap_adjustment = "Roadmap adjusted: Initial focus on enterprise clients. Sales cycle expected to be 3-6 months."
        else:  # Technology Stack Conflict
            roadmap_adjustment = "Roadmap adjusted: Using established technologies initially, with plans to evaluate newer options in the future."
    else:  # CTO won
        if conflict_type == 'MVP Scope Conflict':
            roadmap_adjustment = "Roadmap adjusted: Extended development timeline to build robust foundation. Launch delayed but with more complete offering."
        elif conflict_type == 'Market Focus Conflict':
            roadmap_adjustment = "Roadmap adjusted: Consumer-first approach with rapid iteration cycles. Enterprise features planned for future releases."
        else:  # Technology Stack Conflict
            roadmap_adjustment = "Roadmap adjusted: Implementing cutting-edge technology stack. Additional engineering resources allocated for innovation."
    
    return jsonify({
        "roadmap_adjustment": roadmap_adjustment,
        "session_id": session_id
    })

@app.route('/api/investor-qa', methods=['POST'])
def investor_qa():
    data = request.json
    messages = data.get('messages', [])
    try:
        qa = simulate_investor_qa(messages)
        return jsonify({'qa': qa})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/risk-map', methods=['POST'])
def risk_map():
    data = request.json
    messages = data.get('messages', [])
    try:
        riskmap = generate_risk_map(messages)
        return jsonify({'riskmap': riskmap})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
