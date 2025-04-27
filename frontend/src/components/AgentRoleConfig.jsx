import React from "react";

const roles = ["PM", "Unpaid Intern", "CTO", "Investor", "Marketer", "CEO"];
const personalities = [
  "neutral",
  "cautious",
  "optimistic",
  "skeptical",
  "supportive",
  "clueless",
];

export default function AgentRoleConfig({ agents, setAgents }) {
  const handleChange = (idx, field, value) => {
    const updated = agents.map((a, i) =>
      i === idx ? { ...a, [field]: value } : a
    );
    setAgents(updated);
  };
  const addAgent = () => {
    if (agents.length < 5)
      setAgents([...agents, { role: "Marketer", personality: "neutral" }]);
  };
  const removeAgent = (idx) => {
    setAgents(agents.filter((_, i) => i !== idx));
  };
  return (
    <div>
      {agents.map((agent, idx) => (
        <div key={idx} className="flex items-center mb-2">
          <select
            className="border rounded p-1 mr-2"
            value={agent.role}
            onChange={(e) => handleChange(idx, "role", e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-1 mr-2"
            value={agent.personality}
            onChange={(e) => handleChange(idx, "personality", e.target.value)}
          >
            {personalities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {agents.length > 1 && (
            <button
              className="text-red-500 ml-2"
              onClick={() => removeAgent(idx)}
              type="button"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      {agents.length < 5 && (
        <button
          className="mt-2 px-2 py-1 bg-gray-200 rounded"
          onClick={addAgent}
          type="button"
        >
          Add Agent
        </button>
      )}
    </div>
  );
}
