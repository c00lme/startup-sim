import React from 'react';

export default function ConflictDialog({ conflict, onDecision, onClose, loading }) {
  if (!conflict) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold mb-2">Co-Founder Conflict: {conflict.title}</h3>
        <div className="mb-4">
          <div className="mb-2"><span className="font-semibold">PM:</span> {conflict.pm_position}</div>
          <div className="mb-2"><span className="font-semibold">CTO:</span> {conflict.cto_position}</div>
          <div className="mb-2"><span className="font-semibold">Stakes:</span> {conflict.stakes}</div>
        </div>
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 flex-1"
            onClick={() => onDecision('pm')}
            disabled={loading}
          >
            Side with PM
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700 flex-1"
            onClick={() => onDecision('cto')}
            disabled={loading}
          >
            Side with CTO
          </button>
        </div>
        <button
          className="mt-4 w-full text-gray-600 underline"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
