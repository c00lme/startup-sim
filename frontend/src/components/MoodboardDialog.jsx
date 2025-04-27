import React from 'react';

// Simple X icon component (or use a library like heroicons)
const XIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props} // Pass className, onClick, etc.
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export default function MoodboardDialog({ moodboard, onClose }) {
  if (!moodboard) return null;
  // moodboard is a plain string
  const urlRegex = /https?:\/\/(\S+\.(?:jpg|jpeg|png|webp|svg|gif))/gi;
  const urls = Array.from(moodboard.matchAll(urlRegex)).map(m => m[0]);
  const desc = moodboard.replace(urlRegex, '').replace(/\s+/g, ' ').trim();

  return (
    // Modal Overlay - subtle dark background
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      aria-modal="true"
      role="dialog"
    >
      {/* Dialog Content - smaller width, refined styling */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span role="img" aria-label="Palette emoji">🎨</span> Brand Moodboard
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            aria-label="Close moodboard dialog"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Image Grid - more structured layout */}
          {urls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {urls.map((url, i) => (
                <div key={i} className="aspect-square relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                   <img
                    src={url}
                    alt={`Moodboard visual ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                    loading="lazy" // Add lazy loading for performance
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description - cleaner typography */}
          {desc && (
            <div className="text-sm text-gray-600 pt-2 whitespace-pre-wrap">
              {desc}
            </div>
          )}

          {urls.length === 0 && !desc && (
             <p className="text-center text-gray-500 py-4">No moodboard content provided.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
          <button
            className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>

      {/* Add custom animation if needed (Tailwind might not have fade-scale-in directly) */}
      <style jsx global>{`
        @keyframes fade-scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-scale-in {
          animation: fade-scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}