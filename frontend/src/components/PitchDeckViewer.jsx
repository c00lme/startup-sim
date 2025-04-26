import React, { useState } from 'react';

export default function PitchDeckViewer({ pitchDeck }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Split slides by blank lines
  const slides = pitchDeck.split('\n\n');
  const totalSlides = slides.length;
  
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const renderSlideContent = (content) => {
    // Process the slide content to identify different elements like titles and bullet points
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (i === 0) {
        // Assume the first line is always the slide title
        return (
          <h3 key={i} className="text-2xl font-bold text-blue-900 mb-6">
            {line}
          </h3>
        );
      } else if (line.startsWith('- ') || line.startsWith('• ')) {
        // Bullet points
        return (
          <div key={i} className="flex items-start gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
            <p className="text-gray-700">{line.substring(2)}</p>
          </div>
        );
      } else if (line.trim() === '') {
        // Empty line
        return <div key={i} className="h-4"></div>;
      } else if (line.includes(':')) {
        // Key-value pairs
        const [key, value] = line.split(':');
        return (
          <div key={i} className="flex mb-3">
            <span className="font-medium text-blue-700 min-w-[120px]">{key}:</span>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      } else {
        // Regular paragraph
        return (
          <p key={i} className="text-gray-700 mb-3">
            {line}
          </p>
        );
      }
    });
  };
  
  return (
    <div className="relative">
      {/* Slide counter pill */}
      <div className="absolute -top-4 right-0 bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-medium shadow-md">
        {currentSlide + 1} / {totalSlides}
      </div>
      
      {/* Slide content */}
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 border-b border-blue-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="ml-4 text-blue-700 font-medium">Pitch Deck Presentation</div>
          </div>
        </div>
        
        <div className="p-8 min-h-[300px]">
          <div className="animate-fade-in">
            {renderSlideContent(slides[currentSlide])}
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-blue-100 flex justify-between items-center">
          <button
            onClick={goToPrevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentSlide === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 shadow hover:shadow-md hover:text-blue-700 hover:bg-blue-50'
            } transition-all`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <div className="flex gap-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentSlide ? 'bg-blue-600' : 'bg-blue-200'
                } transition-all`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={goToNextSlide}
            disabled={currentSlide === totalSlides - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentSlide === totalSlides - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 shadow hover:shadow-md hover:text-blue-700 hover:bg-blue-50'
            } transition-all`}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Thumbnails row (optional for larger screens) */}
      <div className="mt-6 hidden md:grid grid-cols-5 gap-2">
        {slides.slice(0, 5).map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`p-3 text-xs border rounded bg-white hover:border-blue-300 transition-all ${
              idx === currentSlide ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
          >
            <div className="truncate overflow-hidden" style={{ maxHeight: '60px' }}>
              {slide.split('\n')[0]}
            </div>
          </button>
        ))}
        {totalSlides > 5 && (
          <div className="flex items-center justify-center p-3 text-xs border rounded border-gray-200 bg-white text-gray-500">
            +{totalSlides - 5} more
          </div>
        )}
      </div>
    </div>
  );
}