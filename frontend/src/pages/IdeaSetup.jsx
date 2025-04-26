import React, { useState } from 'react';
import AgentRoleConfig from '../components/AgentRoleConfig';
import { startSession } from '../api';

const realismLevels = [
  { label: 'Harsh', value: 'harsh' },
  { label: 'Realistic', value: 'realistic' },
  { label: 'Supportive', value: 'supportive' },
];

export default function IdeaSetup({ onStart }) {
  const [idea, setIdea] = useState('');
  const [realism, setRealism] = useState('realistic');
  const [agents, setAgents] = useState([
    { role: 'PM', personality: 'neutral' },
    { role: 'CTO', personality: 'neutral' },
    { role: 'Investor', personality: 'neutral' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await startSession({ idea, realism, agents });
      if (res.session_id) {
        // Use agents returned by backend (with names)
        onStart({ idea, realism, agents: res.agents, sessionId: res.session_id });
      } else {
        setError('Failed to start session.');
      }
    } catch (e) {
      setError('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Enter Your Startup Idea</h2>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={3}
        placeholder="Describe your startup idea..."
        value={idea}
        onChange={e => setIdea(e.target.value)}
      />
      <h3 className="font-semibold mb-2">Agent Roles & Personalities</h3>
      <AgentRoleConfig agents={agents} setAgents={setAgents} />
      <div className="mt-4">
        <span className="mr-2 font-semibold">Realism Level:</span>
        {realismLevels.map(l => (
          <button
            key={l.value}
            className={`px-3 py-1 rounded mr-2 border ${realism === l.value ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setRealism(l.value)}
            type="button"
          >
            {l.label}
          </button>
        ))}
      </div>
      <button
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
        onClick={handleStart}
        disabled={!idea.trim() || loading}
      >
        {loading ? 'Starting...' : 'Start Simulation'}
      </button>
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
