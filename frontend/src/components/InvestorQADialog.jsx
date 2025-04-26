import React from 'react';

const agentAvatars = {
  PM: '📋',
  CTO: '👨‍💻',
  Investor: '💰',
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full border-4 border-orange-200 animate-fade-in">
        <h3 className="text-2xl font-bold mb-6 text-orange-700 flex items-center gap-2">
          🏆 Investor Q&amp;A
        </h3>
        <div className="space-y-8 max-h-[60vh] overflow-y-auto">
          {qaBlocks.map((block, i) => (
            <div key={i} className="bg-orange-50 rounded-xl shadow p-4 border-l-4 border-orange-400">
              <div className="font-semibold text-lg mb-2 text-orange-900">❓ {block.q}</div>
              <div className="flex flex-col gap-2">
                {block.answers.map((ans, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-2xl">{agentAvatars[ans.role]}</span>
                    <span className="font-bold text-orange-800 w-20 inline-block">{ans.role}:</span>
                    <span className="text-gray-800">{ans.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          className="w-full mt-6 bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700 shadow"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
