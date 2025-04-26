from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
from agents.agent_factory import create_agents_for_session, send_agent_message, get_agent_responses
from summarizer.gemini import summarize_conversation
from report.pdf_generator import generate_pdf_report

load_dotenv()

UAGENTS_API_KEY = os.getenv('UAGENTS_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

app = Flask(__name__)
CORS(app)

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
    send_agent_message(sender, recipient, text)
    responses = get_agent_responses()
    # Clear responses file for next call
    resp_file = os.path.join(os.path.dirname(__file__), 'agents', 'responses.json')
    with open(resp_file, 'w') as f:
        f.write('[]')
    return jsonify({'replies': responses})

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

@app.route('/api/download-report', methods=['GET'])
def download_report():
    # Always returns the latest generated report
    return send_file('business_report.pdf', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
