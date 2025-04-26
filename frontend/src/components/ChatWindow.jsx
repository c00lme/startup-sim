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
      'PM': 'bg-blue-50 border-blue-200 text-blue-700',
      'CTO': 'bg-emerald-50 border-emerald-200 text-emerald-700',
      'Investor': 'bg-amber-50 border-amber-200 text-amber-700',
      'Marketer': 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
      'CEO': 'bg-rose-50 border-rose-200 text-rose-700',
      'User': 'bg-indigo-50 border-indigo-200 text-indigo-700',
    };
    
    // Default fallback for any other sender
    return colors[sender] || 'bg-gray-50 border-gray-200 text-gray-700';
  };
  
  const getAgentEmoji = (sender) => {
    const emojis = {
      'PM': '📋',
      'CTO': '👨‍💻',
      'Investor': '💰',
      'Marketer': '📣',
      'CEO': '👔',
      'User': '🧑',
    };
    
    // Extract just the role part if it includes a personality, e.g., "PM-neutral" → "PM"
    const role = sender.split('-')[0];
    return emojis[role] || '👤';
  };
  
  const getAgentGradient = (sender) => {
    const gradients = {
      'PM': 'from-blue-500 to-blue-600',
      'CTO': 'from-emerald-500 to-teal-600',
      'Investor': 'from-amber-500 to-yellow-600',
      'Marketer': 'from-fuchsia-500 to-purple-600',
      'CEO': 'from-rose-500 to-red-600',
      'User': 'from-indigo-500 to-violet-600',
    };
    
    // Default fallback for any other sender
    return gradients[sender] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="h-full py-4 overflow-y-auto px-2">
      {messages.map((msg, idx) => {
        const isUser = msg.sender === 'User';
        const colorClasses = getAgentColor(msg.sender);
        const gradientClasses = getAgentGradient(msg.sender);
        const emoji = getAgentEmoji(msg.sender);
        
        return (
          <div
            key={idx}
            className={`mb-5 ${isUser ? 'flex justify-end' : 'flex justify-start'}`}
          >
            {!isUser && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gradient-to-br ${gradientClasses} text-white shadow-md text-xl`}>
                {emoji}
              </div>
            )}
            <div
              className={`max-w-[80%] px-5 py-4 rounded-2xl border ${colorClasses} shadow-sm
                        backdrop-blur-sm bg-opacity-90 transform transition-all duration-300 hover:shadow-md`}
            >
              <div className="font-semibold mb-2 flex items-center">
                {msg.sender}
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-opacity-20 bg-gray-500 text-gray-600">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                {msg.text}
              </div>
            </div>
            {isUser && (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 bg-gradient-to-br ${gradientClasses} text-white shadow-md text-xl`}>
                {emoji}
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}