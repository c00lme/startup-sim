# Agent creation logic using Fetch.ai uAgents
#from uagents import Agent  # Do not instantiate Agent in Flask
from .roles import AGENT_ROLES
import os

# This function creates agents with a role and personality (stub only)
def create_agent(role, personality):
    # Return config dict for agent runner compatibility
    return {
        "role": role,
        "personality": personality,
        "name": f"{role}-{personality}"
    }

# Factory to create all agents for a session
def create_agents_for_session(agent_configs):
    agents = []
    for cfg in agent_configs:
        agents.append(create_agent(cfg['role'], cfg['personality']))
    return agents

# Util: send message to agent via file for simulation
import json

def send_agent_message(sender, recipient, text):
    msg_file = os.path.join(os.path.dirname(__file__), "messages.json")
    messages = []
    if os.path.exists(msg_file):
        with open(msg_file, "r") as f:
            try:
                messages = json.load(f)
            except Exception:
                messages = []
    messages.append({"sender": sender, "recipient": recipient, "text": text})
    with open(msg_file, "w") as f:
        json.dump(messages, f)

# Util: get agent responses via file for simulation

def get_agent_responses():
    resp_file = os.path.join(os.path.dirname(__file__), "responses.json")
    responses = []
    if os.path.exists(resp_file):
        with open(resp_file, "r") as f:
            try:
                responses = json.load(f)
            except Exception:
                responses = []
    return responses
