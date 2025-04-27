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

  if (!session) return <div className="p-8 text-center text-gray-600">No session found.</div>;


  const handleInject = async input => {
    setInputLoading(true);
    setError('');
    try {
      setMessages(msgs => [...msgs, { sender: 'User', text: input }]);

      await startRoundtable(input); // Use new roundtable/interject API

      const recipient = session.agents[0].name;
      const res = await sendAgentMessage({ sender: 'User', recipient, text: input });
      const replies = res.replies || [];
      setMessages(msgs => [
        ...msgs,
        ...replies.map(r => ({ sender: r.from, text: r.reply }))
      ]);

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
    <div className="max-w-4xl mx-auto mt-14 p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Agent Conversation</h2>
      <div className="mb-8">
        <ChatWindow messages={messages} />
      </div>
      <div className="mb-8">
        <Controls
          paused={paused}
          setPaused={setPaused}
          onInject={handleInject}
          onClarify={handleClarify}
          onEnd={handleEnd}
        />
      </div>
      {inputLoading && <div className="mt-4 text-center text-blue-500 font-semibold animate-pulse">Processing...</div>}
      {error && <div className="mt-4 text-center text-red-600 font-medium">{error}</div>}
    </div>
  );
}
