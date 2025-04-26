import React, { useEffect, useRef } from 'react';

export default function ChatWindow({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAgentColor = (sender) => {
    const colors = {
      'PM': 'bg-blue-100 border-blue-300 text-blue-800',
      'CTO': 'bg-green-100 border-green-300 text-green-800',
      'Investor': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'Marketer': 'bg-purple-100 border-purple-300 text-purple-800',
      'CEO': 'bg-red-100 border-red-300 text-red-800',
      'User': 'bg-gray-100 border-gray-300 text-gray-800',
    };
    
    // Default fallback for any other sender
    return colors[sender] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  return (
    <div className="h-full py-4 overflow-y-auto">
      {messages.map((msg, idx) => {
        const isUser = msg.sender === 'User';
        const colorClasses = getAgentColor(msg.sender);
        
        return (
          <div 
            key={idx} 
            className={`mb-4 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-4 py-3 rounded-xl border ${colorClasses} shadow-sm
                          transform transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="font-semibold mb-1">
                {msg.sender}
              </div>
              <div className="text-sm md:text-base whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
