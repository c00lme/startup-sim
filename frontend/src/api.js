// API utility functions for frontend
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export async function startSession({ idea, realism, agents }) {
  const res = await fetch(`${API_BASE}/api/start-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, realism, agents })
  });
  return res.json();
}

export async function sendAgentMessage({ sender, recipient, text }) {
  const res = await fetch(`${API_BASE}/api/agent-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender, recipient, text })
  });
  return res.json();
}

export async function completeSession({ sessionId }) {
  const res = await fetch(`${API_BASE}/api/complete-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  return res.json();
}
