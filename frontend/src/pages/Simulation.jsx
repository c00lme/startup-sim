import React, { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import Controls from '../components/Controls';
import { sendAgentMessage, completeSession } from '../api';

export default function Simulation({ session, onOutcome }) {
  const [messages, setMessages] = useState([
    { sender: 'PM', text: 'Welcome to the simulation.' },
  ]);
  const [paused, setPaused] = useState(false);
  const [inputLoading, setInputLoading] = useState(false);
  const [error, setError] = useState('');

  if (!session) return <div className="p-8">No session found.</div>;

  const handleInject = async input => {
    setInputLoading(true);
    setError('');
    try {
      // Append user message
      setMessages(msgs => [...msgs, { sender: 'User', text: input }]);
      // Send to first agent in the session
      const recipient = session.agents[0].name;
      const res = await sendAgentMessage({ sender: 'User', recipient, text: input });
      // Append agent replies
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Agent Conversation</h2>
      <ChatWindow messages={messages} />
      <Controls
        paused={paused}
        setPaused={setPaused}
        onInject={handleInject}
        onClarify={handleClarify}
        onEnd={handleEnd}
      />
      {inputLoading && <div className="mt-2 text-blue-600">Processing...</div>}
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
