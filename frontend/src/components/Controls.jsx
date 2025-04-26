import React, { useState } from 'react';

export default function Controls({ paused, setPaused, onInject, onClarify, onEnd }) {
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onInject(input);
      setInput('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
            Simulation Controls
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${paused ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
            {paused ? 'Paused' : 'Active'}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPaused(!paused)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center ${
              paused 
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {paused ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause
              </>
            )}
          </button>
          
          <button
            onClick={onClarify}
            className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium text-sm transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Clarify
          </button>
          
          <button
            onClick={onEnd}
            className="px-4 py-2 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 font-medium text-sm transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            End
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-30 bg-white/80 backdrop-blur-sm transition-all duration-200 resize-none overflow-hidden shadow-sm"
            placeholder="Type your message to inject into the simulation..."
            rows={expanded ? 4 : 2}
            onFocus={() => setExpanded(true)}
            onBlur={() => !input && setExpanded(false)}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-3 bottom-3 p-2 rounded-lg ${
              input.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-all duration-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setInput(prev => prev + "What's your revenue model?")}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 text-center"
          >
            Revenue Model
          </button>
          <button
            type="button"
            onClick={() => setInput(prev => prev + "Tell me about your target market.")}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 text-center"
          >
            Target Market
          </button>
          <button
            type="button"
            onClick={() => setInput(prev => prev + "What are your growth challenges?")}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 text-center"
          >
            Growth Challenges
          </button>
        </div>
      </form>
      
      <div className="pt-3 border-t border-purple-100">
        <div className="flex items-center text-sm text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Tip:</span>
          <span className="ml-1 text-indigo-500">
            Ask specific questions to get targeted feedback from each agent role.
          </span>
        </div>
      </div>
    </div>
  );
}