import React from 'react';

const agentData = {
  PM: {
    name: 'Product Manager',
    avatar: '📋',
    color: 'bg-blue-100',
    desc: 'Vision, strategy, and feature priorities.'
  },
  CTO: {
    name: 'Chief Technology Officer',
    avatar: '👨‍💻',
    color: 'bg-green-100',
    desc: 'Tech stack, architecture, and engineering risk.'
  },
  Investor: {
    name: 'Investor',
    avatar: '💰',
    color: 'bg-yellow-100',
    desc: 'Funding, runway, and market confidence.'
  }
};

export default function AgentProfileCard({ role }) {
  const agent = agentData[role];
  if (!agent) return null;
  return (
    <div className={`rounded-2xl shadow-lg p-4 flex flex-col items-center ${agent.color} border-2 border-white`}> 
      <div className="text-4xl mb-2">{agent.avatar}</div>
      <div className="font-bold text-lg mb-1 text-gray-800">{agent.name}</div>
      <div className="text-gray-600 text-center text-sm">{agent.desc}</div>
    </div>
  );
}
