import React from 'react';

export default function MoodboardDialog({ moodboard, onClose }) {
  if (!moodboard) return null;
  // Try to extract image URLs (if any) and description
  const urls = Array.from(moodboard.matchAll(/https?:\/\/(\S+\.(?:jpg|jpeg|png|webp|svg))/gi)).map(m => m[0]);
  const desc = moodboard.replace(/https?:\/\/(\S+\.(?:jpg|jpeg|png|webp|svg))/gi, '').trim();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-4 border-pink-200 animate-fade-in">
        <h3 className="text-2xl font-bold mb-6 text-pink-700 flex items-center gap-2">🎨 Brand Moodboard</h3>
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          {urls.length > 0 && urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Moodboard visual ${i+1}`}
              className="rounded-xl border-2 border-pink-200 shadow-md max-h-40 animate-fade-in"
              style={{objectFit:'cover'}}
            />
          ))}
        </div>
        {desc && <div className="text-gray-800 mb-4 whitespace-pre-wrap text-center italic">{desc}</div>}
        <button
          className="w-full mt-6 bg-pink-600 text-white py-2 rounded-xl font-bold hover:bg-pink-700 shadow"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
