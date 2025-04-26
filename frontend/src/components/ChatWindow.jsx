import React from 'react';

export default function ChatWindow({ messages }) {
  return (
    <div className="h-64 overflow-y-auto border rounded p-3 bg-gray-50 mb-4">
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-2">
          <span className="font-semibold text-blue-600 mr-2">{msg.sender}:</span>
          <span>{msg.text}</span>
        </div>
      ))}
    </div>
  );
}
