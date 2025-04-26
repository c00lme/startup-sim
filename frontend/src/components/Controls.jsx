import React, { useState } from 'react';

export default function Controls({ paused, setPaused, onInject, onClarify, onEnd }) {
  const [input, setInput] = useState('');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded ${paused ? 'bg-yellow-400' : 'bg-blue-500 text-white'}`}
          onClick={() => setPaused(!paused)}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button
          className="px-3 py-1 rounded bg-purple-500 text-white"
          onClick={onClarify}
        >Clarify Vision</button>
        <button
          className="px-3 py-1 rounded bg-red-500 text-white"
          onClick={onEnd}
        >End Session</button>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-1"
          placeholder="Inject input..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          className="px-3 py-1 rounded bg-green-500 text-white"
          onClick={() => { if (input.trim()) { onInject(input); setInput(''); } }}
        >Inject</button>
      </div>
    </div>
  );
}
