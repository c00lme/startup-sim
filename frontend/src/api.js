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

export async function completeSession({ sessionId, messages }) {
  const res = await fetch(`${API_BASE}/api/complete-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, messages })
  });
  return res.json();
}

export async function fetchConversationFeed() {
  const res = await fetch(`${API_BASE}/api/conversation-feed`);
  if (!res.ok) throw new Error('Failed to fetch conversation feed');
  return res.json();
}

export async function startRoundtable(message) {
  const res = await fetch(`http://127.0.0.1:8000/start_roundtable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message })
  });
  if (!res.ok) throw new Error('Failed to start roundtable');
  return res.json();
}

export async function fetchPitchDeck(messages) {
  const res = await fetch(`${API_BASE}/api/pitch-deck`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  if (!res.ok) throw new Error('Failed to fetch pitch deck');
  return res.json();
}

export async function simulateConflict({ sessionId, idea }) {
  const res = await fetch(`${API_BASE}/api/simulate-conflict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, idea })
  });
  return res.json();
}

export async function resolveConflict({ sessionId, conflictType, winner }) {
  const res = await fetch(`${API_BASE}/api/resolve-conflict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, conflict_type: conflictType, winner })
  });
  return res.json();
}

export async function fetchMoodboard({ idea, messages }) {
  const res = await fetch(`${API_BASE}/api/brand-moodboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, messages })
  });
  return res.json();
}

export async function fetchInvestorQA(messages) {
  const res = await fetch(`${API_BASE}/api/investor-qa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  return res.json();
}

export async function fetchRiskMap(messages) {
  const res = await fetch(`${API_BASE}/api/risk-map`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  return res.json();
}
