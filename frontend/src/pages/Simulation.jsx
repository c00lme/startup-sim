import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import Controls from '../components/Controls';
import { sendAgentMessage, completeSession, fetchConversationFeed, startRoundtable } from '../api';

export default function Simulation({ session, onOutcome }) {
  const [messages, setMessages] = useState([
    { sender: 'PM', text: 'Welcome to the simulation.' },
  ]);
  const [paused, setPaused] = useState(false);
  const [inputLoading, setInputLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const feed = await fetchConversationFeed();
        setMessages(feed.comments.map(c => ({ sender: c.agent, text: c.message })));
      } catch (e) {
        // ignore fetch errors
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (!session) return <div className="p-8">No session found.</div>;

  const handleInject = async input => {
    setInputLoading(true);
    setError('');
    try {
      setMessages(msgs => [...msgs, { sender: 'User', text: input }]);
      await startRoundtable(input); // Use new roundtable/interject API
    } catch (e) {
      setError('Server error.');
    } finally {
      setInputLoading(false);
    }
  };

  const handleClarify = () => handleInject('Clarification from user.');
  const handleEnd = async () => {
    setInputLoading(true);
    setError('');
    try {
      const res = await completeSession({ sessionId: session.sessionId });
      onOutcome({ ...res, messages });
    } catch (e) {
      setError('Could not complete session.');
    } finally {
      setInputLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-200 p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-extrabold text-blue-900 mb-3 tracking-tight">
            Startup Simulation
          </h2>
          <p className="text-purple-700 text-xl">AI Agent Roundtable</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-purple-200">
          <div className="p-5 bg-gradient-to-r from-blue-100 to-purple-100 border-b border-purple-200">
            <h3 className="text-2xl font-bold text-indigo-800">Agent Conversation</h3>
          </div>
          <div className="h-[450px] p-6 overflow-y-auto bg-white/70">
            <ChatWindow messages={messages} />
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-purple-200 p-6">
          <Controls
            paused={paused}
            setPaused={setPaused}
            onInject={handleInject}
            onClarify={handleClarify}
            onEnd={handleEnd}
          />
          
          {inputLoading && (
            <div className="flex items-center justify-center mt-4 text-indigo-700">
              <svg className="animate-spin mr-3 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing
            </div>
          )}
          {error && <div className="text-center text-red-500 animate-pulse mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
}
