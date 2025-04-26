import React from 'react';

const riskIcons = {
  'Tech Risk': '👨‍💻',
  'Market Risk': '📈',
  'Funding Risk': '💰',
};
const riskColors = [
  'bg-green-200',
  'bg-yellow-200',
  'bg-orange-200',
  'bg-red-200',
];

function parseRiskMap(riskmap) {
  // Expect lines like: Tech Risk: 7/10 - justification
  return riskmap
    .split('\n')
    .map(line => {
      const match = line.match(/(.*?): (\d+)\/10 - (.*)/);
      if (!match) return null;
      const [, type, score, desc] = match;
      return { type, score: parseInt(score), desc };
    })
    .filter(Boolean);
}

function getRiskColor(score) {
  if (score <= 3) return riskColors[0];
  if (score <= 6) return riskColors[1];
  if (score <= 8) return riskColors[2];
  return riskColors[3];
}

export default function RiskMapDialog({ riskmap, onClose }) {
  if (!riskmap) return null;
  const risks = parseRiskMap(riskmap);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full border-4 border-green-200 animate-fade-in">
        <h3 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">🛡️ Startup Risk Map</h3>
        <div className="space-y-6">
          {risks.map((r, i) => (
            <div key={i} className={`rounded-xl shadow flex items-center gap-4 p-4 border-l-8 ${getRiskColor(r.score)}`}>
              <span className="text-3xl">{riskIcons[r.type]}</span>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900">{r.type}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-3 w-32 bg-gray-200 rounded">
                    <div
                      className={`h-3 rounded ${getRiskColor(r.score)}`}
                      style={{ width: `${(r.score / 10) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-lg text-gray-700">{r.score}/10</span>
                </div>
                <div className="text-gray-700 mt-2 italic">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="w-full mt-8 bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700 shadow"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
