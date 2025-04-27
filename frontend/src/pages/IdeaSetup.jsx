import React, { useState, useEffect, useRef } from 'react';
import AgentRoleConfig from '../components/AgentRoleConfig';
import { startSession } from '../api';

const realismLevels = [
  { label: 'Harsh', value: 'harsh' },
  { label: 'Realistic', value: 'realistic' },
  { label: 'Supportive', value: 'supportive' },
];

const personalities = [
    { label: 'Neutral', value: 'neutral' },
    { label: 'Optimistic', value: 'optimistic' },
    { label: 'Pessimistic', value: 'pessimistic' },
    { label: 'Aggressive', value: 'aggressive' },
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

  const handleAgentChange = (index, field, value) => {
      const newAgents = [...agents];
      newAgents[index][field] = value;
      setAgents(newAgents);
  };

  // Refs for observing sections
  const ideaRef = useRef(null);
  const teamRef = useRef(null);
  const realismRef = useRef(null);
  const buttonRef = useRef(null);

  const [ideaVisible, setIdeaVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [realismVisible, setRealismVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3, // Adjust as needed
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === ideaRef.current) {
          setIdeaVisible(entry.isIntersecting);
        } else if (entry.target === teamRef.current) {
          setTeamVisible(entry.isIntersecting);
        } else if (entry.target === realismRef.current) {
          setRealismVisible(entry.isIntersecting);
        } else if (entry.target === buttonRef.current) {
          setButtonVisible(entry.isIntersecting);
        }
      });
    }, observerOptions);

    if (ideaRef.current) observer.observe(ideaRef.current);
    if (teamRef.current) observer.observe(teamRef.current);
    if (realismRef.current) observer.observe(realismRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);

    return () => observer.disconnect(); // Cleanup on unmount
  }, []);

  return (
    <div className="w-screen min-h-screen overflow-x-hidden" style={{
      background: 'linear-gradient(45deg, #ff5e62 30%, #ff9966 90%)',
      color: 'white',
      fontFamily: 'sans-serif',
      paddingBottom: '4rem',
    }}>

      <header className="py-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Dream Incubator</h1>
        <p className="text-lg">Unleash your startup vision.</p>
      </header>

      <section ref={ideaRef} className={`container mx-auto py-12 px-6 transition-all duration-700 rounded-3xl ${ideaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} relative overflow-hidden`} style={{
          background: 'rgba(255, 140, 0, 0.1)', // Match Orange Hue
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
          //backdropFilter: 'blur(5px)', //Optional Blur
      }}>
        <div className="absolute inset-0 rounded-3xl border-2 border-opacity-0 animate-pulse" style={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            animationDelay: '0.5s',
        }}></div>
        <h2 className="text-3xl font-semibold mb-6">Idea Description</h2>
        <textarea
          className="w-full border border-gray-700 rounded-2xl p-4 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-800 transition-all duration-300 bg-gray-800 text-gray-100"
          rows={4}
          placeholder="Describe your groundbreaking idea..."
          value={idea}
          onChange={e => setIdea(e.target.value)}
        />
      </section>

      <section ref={teamRef} className={`container mx-auto py-12 px-6 transition-all duration-700 rounded-3xl ${teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} relative overflow-hidden`} style={{
          background: 'rgba(255, 140, 0, 0.1)', // Match Orange Hue
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
          //backdropFilter: 'blur(5px)', // Optional Blur
      }}>
        <div className="absolute inset-0 rounded-3xl border-2 border-opacity-0 animate-pulse" style={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            animationDelay: '0.7s',
        }}></div>
        <h2 className="text-3xl font-semibold mb-6">Assemble Your Team</h2>
        <div>
          {agents.map((agent, index) => (
            <div key={index} className="mb-4 p-4 rounded-2xl bg-gray-800 border border-gray-700">
              <h4 className="font-semibold mb-2">{`Agent ${index + 1}`}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    className="w-full border border-gray-700 rounded-md p-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-blue-500"
                    value={agent.role}
                    onChange={(e) => handleAgentChange(index, 'role', e.target.value)}
                    placeholder="e.g., CEO, Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Personality</label>
                  <select
                    className="w-full border border-gray-700 rounded-md p-2 bg-gray-700 text-gray-100 focus:outline-none focus:border-blue-500"
                    value={agent.personality}
                    onChange={(e) => handleAgentChange(index, 'personality', e.target.value)}
                  >
                    {personalities.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section ref={realismRef} className={`container mx-auto py-12 px-6 transition-all duration-700 rounded-3xl ${realismVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} relative overflow-hidden`} style={{
          background: 'rgba(255, 140, 0, 0.1)', // Match Orange Hue
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
           //backdropFilter: 'blur(5px)', // Optional Blur
      }}>
        <div className="absolute inset-0 rounded-3xl border-2 border-opacity-0 animate-pulse" style={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            animationDelay: '0.9s',
        }}></div>
        <h2 className="text-3xl font-semibold mb-6">Set Realism Level</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {realismLevels.map(l => (
            <button
              key={l.value}
              className={`px-6 py-3 rounded-full font-semibold text-md transition-all duration-300 ${
                realism === l.value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:border-blue-500'
              }`}
              onClick={() => setRealism(l.value)}
              type="button"
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <div ref={buttonRef} className={`container mx-auto py-12 px-6 text-center transition-all duration-700 ${buttonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <button
          className="w-full md:w-auto py-4 px-8 rounded-full text-2xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-500 bg-blue-600 hover:bg-blue-700"
          onClick={handleStart}
          disabled={!idea.trim() || loading}
        >
          {loading ? 'Simulating...' : 'Begin Simulation 🚀'}
        </button>
        {error && <div className="mt-6 text-center text-red-500 font-semibold animate-pulse">{error}</div>}
      </div>
    </div>
  );
}