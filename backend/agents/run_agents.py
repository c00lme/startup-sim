from uagents import Agent, Context, Protocol
from roles import AGENT_ROLES
import json
import os
import asyncio
import requests
from dotenv import load_dotenv

load_dotenv()

ASI1_API_KEY = os.getenv("ASI1_API_KEY")
if not ASI1_API_KEY:
    raise RuntimeError("ASI1_API_KEY is required in your .env file!")

class LLM:
    def __init__(self, api_key, model="asi1-mini", temperature=0.7, max_tokens=500):
        self.url = "https://api.asi1.ai/v1/chat/completions"
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens

    def send(self, message):
        payload = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": message}
            ],
            "temperature": self.temperature,
            "stream": False,
            "max_tokens": self.max_tokens
        }

        response = requests.post(self.url, headers=self.headers, data=json.dumps(payload))
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            raise Exception(f"Request failed: {response.status_code} - {response.text}")

llm = LLM(api_key=ASI1_API_KEY)

MSG_FILE = os.path.join(os.path.dirname(__file__), "messages.json")
RESP_FILE = os.path.join(os.path.dirname(__file__), "responses.json")

# Assign a unique port and endpoint for each agent
AGENT_PORTS = [8000 + i for i in range(len(AGENT_ROLES))]
AGENT_ENDPOINTS = [f"http://127.0.0.1:{port}" for port in AGENT_PORTS]

def make_agent(role, personality, all_agents, idx):
    agent = Agent(
        name=f"{role}-{personality}",
        port=AGENT_PORTS[idx],
        endpoint=AGENT_ENDPOINTS[idx]
    )
    proto = Protocol(f"{role}_protocol")

    @proto.on_message
    async def on_message(ctx: Context, sender: str, msg: str):
        # Use the LLM to generate a reply
        try:
            ai_reply = llm.send(msg)
        except Exception as e:
            ai_reply = f"[Error from LLM]: {e}"
        # Write the reply to the responses file (append mode)
        responses = []
        if os.path.exists(RESP_FILE):
            with open(RESP_FILE, "r") as f:
                try:
                    responses = json.load(f)
                except Exception:
                    responses = []
        responses.append({"recipient": ctx.address, "from": sender, "reply": ai_reply})
        with open(RESP_FILE, "w") as f:
            json.dump(responses, f)
        await ctx.send(sender, ai_reply)

        # Chain: send a message to the next agent
        idx = [a.name for a in all_agents].index(agent.name)
        next_idx = (idx + 1) % len(all_agents)
        next_agent = all_agents[next_idx]
        # Only send if not looping back to sender
        if next_agent.name != sender:
            await ctx.send(next_agent.address, f"Follow-up from {role}")

    agent.include(proto)
    return agent

# Create all agents and pass the full list for roundtable logic
agents = [None] * len(AGENT_ROLES)
for i, cfg in enumerate(AGENT_ROLES):
    agents[i] = make_agent(cfg["role"], cfg["default_personality"], agents, i)

# Poll for new messages from the file and deliver them to the correct agent
async def poll_messages():
    last_seen = 0
    while True:
        if os.path.exists(MSG_FILE):
            with open(MSG_FILE, "r") as f:
                try:
                    messages = json.load(f)
                except Exception:
                    messages = []
            # Only process new messages
            for msg in messages[last_seen:]:
                # Find agent by name
                for agent in agents:
                    if agent.name == msg["recipient"]:
                        # Simulate receiving a message by calling the protocol handler directly
                        # Use the protocol's on_message handler
                        for proto in agent.protocols.values():
                            # Find the on_message handler
                            if hasattr(proto, "_unsigned_message_handlers"):
                                for cb in proto._unsigned_message_handlers.values():
                                    # Simulate context and call handler
                                    class DummyCtx:
                                        address = agent.name
                                    await cb(DummyCtx(), msg["sender"], msg["text"])
            last_seen = len(messages)
        await asyncio.sleep(1)

if __name__ == "__main__":
    async def main():
        # Start all agents asynchronously
        for agent in agents:
            asyncio.create_task(agent.run_async())
        # Poll for new messages and dispatch
        await poll_messages()

    asyncio.run(main())
