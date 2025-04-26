import React from 'react';

const agentAvatars = {
  PM: {
    emoji: '📋',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    iconBg: 'bg-blue-600'
  },
  CTO: {
    emoji: '👨‍💻',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-300',
    iconBg: 'bg-indigo-600'
  },
  Investor: {
    emoji: '💰',
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    iconBg: 'bg-amber-600'
  },
};

function parseQA(qa) {
  // Split into blocks for each Q&A
  return qa.split(/\n(?=Q: )/).map((block, idx) => {
    const lines = block.trim().split('\n');
    const q = lines[0].replace('Q: ', '');
    const answers = lines.slice(1).map(line => {
      const [role, answer] = line.split(': ');
      return { role, answer };
    });
    return { q, answers };
  });
}

export default function InvestorQADialog({ qa, onClose }) {
  if (!qa) return null;
  const qaBlocks = parseQA(qa);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10 pattern-dots"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-300 rounded-full opacity-20 blur-2xl"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Investor Q&A Session</h3>
            </div>
            
            <button 
              onClick={onClose}
              className="rounded-full p-2 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-8">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {qaBlocks.map((block, i) => (
              <div key={i} className="rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 border-b border-orange-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-200 p-2 rounded-lg mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="font-medium text-gray-800 text-lg">{block.q}</p>
                  </div>
                </div>
                
                <div className="bg-white p-5">
                  <div className="space-y-4">
                    {block.answers.map((ans, j) => {
                      const agent = agentAvatars[ans.role] || {};
                      
                      return (
                        <div key={j} className={`flex items-start gap-3 p-3 rounded-lg ${agent.color || 'bg-gray-50'}`}>
                          <div className={`flex-shrink-0 w-10 h-10 ${agent.iconBg || 'bg-gray-600'} rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
                            <span>{agent.emoji || ans.role[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold mb-1 ${agent.textColor || 'text-gray-800'}`}>
                              {ans.role}
                            </div>
                            <p className="text-gray-700">{ans.answer}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer with close button */}
        <div className="bg-gray-50 border-t border-gray-100 p-6 flex justify-end">
          <button
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg shadow hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}