import React, { useState } from 'react';
import ReportSummary from '../components/ReportSummary';
import { fetchPitchDeck } from '../api';

export default function Outcome({ report, messages, onRestart }) {
  const [pitchDeck, setPitchDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePitchDeck = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchPitchDeck(messages);
      setPitchDeck(res.pitch_deck);
    } catch (e) {
      setError('Could not generate pitch deck.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Session Outcome</h2>
      {report && (
        <ReportSummary report={report} />
      )}
      {report && report.report_url && (
        <a
          href={report.report_url}
          className="mt-6 block w-full text-center bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700"
          download="business_report.pdf"
        >
          Download PDF Report
        </a>
      )}
      <button
        className="mt-4 w-full bg-gray-200 py-2 rounded font-semibold"
        onClick={onRestart}
      >
        Start New Simulation
      </button>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={handlePitchDeck} disabled={loading}>
        {loading ? 'Generating Pitch Deck...' : 'Generate Pitch Deck'}
      </button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {pitchDeck && (
        <div className="whitespace-pre-line border rounded p-4 bg-gray-50 mt-4">
          <h3 className="font-bold text-lg mb-2">Pitch Deck</h3>
          {pitchDeck}
        </div>
      )}
    </div>
  );
}
