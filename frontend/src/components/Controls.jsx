import React, { useState } from 'react';

export default function Controls({ paused, setPaused, onInject, onClarify, onEnd, className = '' }) {
  const [input, setInput] = useState('');
  
  const buttonBaseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center";
  const inputClasses = "flex-1 rounded-lg border border-indigo-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/70 backdrop-blur-sm";
  
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-3 gap-2">
        <button
          className={`${buttonBaseClasses} ${className} ${paused 
            ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' 
            : 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300'}`}
          onClick={() => setPaused(!paused)}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button
          className={`${buttonBaseClasses} ${className} bg-purple-200 text-purple-800 hover:bg-purple-300`}
          onClick={onClarify}
        >
          Clarify Vision
        </button>
        <button
          className={`${buttonBaseClasses} ${className} bg-red-200 text-red-800 hover:bg-red-300`}
          onClick={onEnd}
        >
          End Session
        </button>
      </div>
      <div className="flex gap-2 mt-2">
        <input
          className={inputClasses}
          placeholder="Enter your message or prompt here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              onInject(input);
              setInput('');
            }
          }}
        />
        <button
          className={`${buttonBaseClasses} bg-green-200 text-green-800 hover:bg-green-300 min-w-[100px]`}
          onClick={() => { 
            if (input.trim()) { 
              onInject(input); 
              setInput(''); 
            } 
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
