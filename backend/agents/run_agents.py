from uagents import Agent, Bureau, Context, Model, Protocol

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
    def __init__(self, api_key, model="asi1-mini", temperature=0.7, max_tokens=100):
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


class Message(Model):
    message: str

class KickoffRequest(Model):
    message: str

class KickoffResponse(Model):
    status: str
    detail: str

# Map agent addresses to names for logging/context
addressToName = {}

BACKEND_URL = "http://127.0.0.1:5000/api/agent-comment"

def post_agent_comment(agent_name, sender, message):
    payload = {
        "agent": agent_name,
        "sender": sender,
        "message": message
    }
    try:
        requests.post(BACKEND_URL, json=payload, timeout=5)
    except Exception as e:
        print(f"[WARN] Could not post agent comment: {e}")

# Shared state for kickoff/interjection
latest_user_message = {"text": None}

# Agent creation using uAgents-native approach
def make_agent(role, personality, idx):
    agent = Agent(
        name=f"{role}-{personality}",
        port=8000 + idx,
        endpoint=f"http://127.0.0.1:{8000 + idx}",
        seed=f"{role}-seed",
        mailbox=True,
    )

    llm = LLM(api_key=ASI1_API_KEY)

    async def initialize_llm():
        prompt = """
        You will be roleplaying as multiple personalities. The user will tell you which one to use. Respond
        in only 5 WORDS. DO NOT USE AESTRIKS, BOLD, EMOJIS, OR TEXT STYLING. This is absolutely crucial.
        IF YOU DO NOT FOLLOW THESE GUIDELINES, PEOPLE WILL DIE. It is up to you.
        """
        llm_response = await asyncio.to_thread(llm.send, prompt)
        print("LLM Initialized")
    @agent.on_event("startup")
    async def on_startup(ctx: Context):
        addressToName[ctx.agent.address] = ctx.agent.name
        asyncio.run(initialize_llm())

    @agent.on_message(model=Message)
    async def handle_message(ctx: Context, sender: str, msg: Message):
        sender_name = addressToName.get(sender, sender)
        ctx.logger.info(f"received: '{msg.message}' from {sender_name}")
        llmString = f"{sender_name} says: {msg.message}. Respond as {ctx.agent.name}."
        llm_response = await asyncio.to_thread(llm.send, llmString)

        await ctx.send(sender, Message(message=llm_response))
        # Post every agent reply to the backend
        post_agent_comment(ctx.agent.name, sender_name, llm_response)
        # Optionally, forward to next agent for roundtable
        idx = [a.name for a in agents].index(agent.name)
        next_idx = (idx + 1) % len(agents)
        next_agent = agents[next_idx]
        if next_agent.name != sender:
            await ctx.send(next_agent.address, Message(message=f"Follow-up from {agent.name}: {llm_response}"))
            post_agent_comment(ctx.agent.name, next_agent.name, f"Follow-up from {agent.name}: {llm_response}")

    # Only add the kickoff endpoint to the first agent (PM-neutral)
    if role == "PM" and personality == "neutral":
        @agent.on_rest_post("/start_roundtable", KickoffRequest, KickoffResponse)
        async def handle_kickoff(ctx: Context, req: KickoffRequest) -> KickoffResponse:
            latest_user_message["text"] = req.message
            ctx.logger.info(f"User kickoff/interject: {req.message}")
            # Start the roundtable
            await start_roundtable(ctx, req.message)
            return KickoffResponse(status="ok", detail="Roundtable started")

        async def start_roundtable(ctx: Context, kickoff_message: str):
            # Start with the kickoff message and pass through all agents
            msg = kickoff_message
            sender_name = "User"
            for i, ag in enumerate(agents):
                llmString = f"{sender_name} says: {msg}. Respond as {ag.name}"
                # await asyncio.sleep(5)
                llm_response = await asyncio.to_thread(llm.send, llmString)
                post_agent_comment(ag.name, sender_name, llm_response)
                sender_name = ag.name
                msg = llm_response

    return agent

# Create all agents
agents = [make_agent(cfg["role"], cfg["default_personality"], i) for i, cfg in enumerate(AGENT_ROLES)]

# bureau = Bureau()
# for agent in agents:
#     bureau.add(agent)

async def run_agents():
    await asyncio.gather(*[agent.run_async() for agent in agents])

if __name__ == "__main__":
    asyncio.run(run_agents())
