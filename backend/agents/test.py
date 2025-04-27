import requests

BACKEND_URL = "http://127.0.0.1:5000/api/agent-comment"


payload = {
    "agent": "freaky agent",
    "sender": "freaky agent",
    "message": "trestistnst" 
}
try:
    requests.post(BACKEND_URL, json=payload, timeout=5)
except Exception as e:
    print(f"[WARN] Could not post agent comment: {e}")