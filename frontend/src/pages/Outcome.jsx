import React, { useState, useEffect } from 'react';
import ReportSummary from '../components/ReportSummary';
import PitchDeckViewer from '../components/PitchDeckViewer';
import ConflictDialog from '../components/ConflictDialog';
import MoodboardDialog from '../components/MoodboardDialog';
import InvestorQADialog from '../components/InvestorQADialog';
import RiskMapDialog from '../components/RiskMapDialog';
import AgentProfileCard from '../components/AgentProfileCard';
import Confetti from '../components/Confetti';
import { fetchPitchDeck, simulateConflict, resolveConflict, fetchMoodboard, fetchInvestorQA, fetchRiskMap } from '../api';

export default function Outcome({ report, onRestart }) {
  const [pitchDeck, setPitchDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(null);
  const [conflictLoading, setConflictLoading] = useState(false);
  const [conflictResult, setConflictResult] = useState(null);
  const [moodboard, setMoodboard] = useState(null);
  const [moodboardLoading, setMoodboardLoading] = useState(false);
  const [qa, setQA] = useState(null);
  const [qaLoading, setQALoading] = useState(false);
  const [riskmap, setRiskmap] = useState(null);
  const [riskmapLoading, setRiskmapLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Extract these from report for API calls
  const sessionId = report?.session_id || report?.sessionId;
  const idea = report?.idea;
  const messages = report?.messages;

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

  const handleSimulateConflict = async () => {
    setConflictLoading(true);
    setConflictResult(null);
    try {
      const res = await simulateConflict({ sessionId, idea });
      setConflict(res.conflict);
    } catch (e) {
      setError('Could not simulate conflict.');
    }
    setConflictLoading(false);
  };

  const handleResolveConflict = async (winner) => {
    setConflictLoading(true);
    try {
      const res = await resolveConflict({ sessionId, conflictType: conflict.title, winner });
      setConflictResult(res.roadmap_adjustment);
      setConflict(null);
    } catch (e) {
      setError('Could not resolve conflict.');
    }
    setConflictLoading(false);
  };

  const handleMoodboard = async () => {
    setMoodboardLoading(true);
    setError('');
    try {
      const res = await fetchMoodboard({ idea, messages });
      setMoodboard(res.moodboard);
    } catch (e) {
      setError('Could not generate moodboard.');
    }
    setMoodboardLoading(false);
  };

  const handleQA = async () => {
    setQALoading(true);
    setError('');
    try {
      const res = await fetchInvestorQA(messages);
      setQA(res.qa);
    } catch (e) {
      setError('Could not generate investor Q&A.');
    }
    setQALoading(false);
  };

  const handleRiskmap = async () => {
    setRiskmapLoading(true);
    setError('');
    try {
      const res = await fetchRiskMap(messages);
      setRiskmap(res.riskmap);
    } catch (e) {
      setError('Could not generate risk map.');
    }
    setRiskmapLoading(false);
  };

  useEffect(() => {
    if (pitchDeck || qa) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [pitchDeck, qa]);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-8 bg-gradient-to-br from-orange-50 via-white to-green-50 rounded-3xl shadow-2xl border-4 border-orange-100 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Session Outcome</h2>
      {/* Agent Profile Cards */}
      <div className="flex justify-center gap-6 mb-8 animate-fade-in">
        <AgentProfileCard role="PM" />
        <AgentProfileCard role="CTO" />
        <AgentProfileCard role="Investor" />
      </div>
      <Confetti trigger={showConfetti} />
      {report && (
        <div className="mb-6">
          <ReportSummary report={report} />
        </div>
      )}
      {report && report.report_url && (
        <a
          href={report.report_url}
          className="mt-6 block w-full text-center bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-800 shadow-lg transition"
          download="business_report.pdf"
        >
          Download PDF Report
        </a>
      )}
      <div className="flex flex-wrap gap-4 mt-4 mb-6">
        <button
          className="flex-1 min-w-[170px] bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-3 rounded-xl font-bold shadow-md hover:from-blue-600 hover:to-blue-800 transition"
          onClick={handlePitchDeck}
          disabled={loading}
        >
          {loading ? 'Generating Pitch Deck...' : 'Generate Pitch Deck'}
        </button>
        <button
          className="flex-1 min-w-[170px] bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-3 rounded-xl font-bold shadow-md hover:from-yellow-500 hover:to-yellow-700 transition"
          onClick={handleSimulateConflict}
          disabled={conflictLoading}
        >
          {conflictLoading ? 'Simulating Conflict...' : 'Simulate Co-Founder Conflict'}
        </button>
        <button
          className="flex-1 min-w-[170px] bg-gradient-to-r from-pink-400 to-pink-600 text-white px-4 py-3 rounded-xl font-bold shadow-md hover:from-pink-500 hover:to-pink-700 transition"
          onClick={handleMoodboard}
          disabled={moodboardLoading}
        >
          {moodboardLoading ? 'Generating Moodboard...' : 'Generate Brand Moodboard'}
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          className="flex-1 min-w-[170px] bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-3 rounded-xl font-bold shadow-md hover:from-orange-500 hover:to-orange-700 transition"
          onClick={handleQA}
          disabled={qaLoading}
        >
          {qaLoading ? 'Simulating Investor Q&A...' : 'Investor Q&A'}
        </button>
        <button
          className="flex-1 min-w-[170px] bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 rounded-xl font-bold shadow-md hover:from-green-500 hover:to-green-700 transition"
          onClick={handleRiskmap}
          disabled={riskmapLoading}
        >
          {riskmapLoading ? 'Generating Risk Map...' : 'Risk Map'}
        </button>
        <button
          className="flex-1 min-w-[170px] bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 px-4 py-3 rounded-xl font-bold shadow-md hover:from-gray-400 hover:to-gray-500 transition"
          onClick={onRestart}
        >
          Start New Simulation
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {conflict && (
        <ConflictDialog
          conflict={conflict}
          onDecision={handleResolveConflict}
          onClose={() => setConflict(null)}
          loading={conflictLoading}
        />
      )}
      {conflictResult && (
        <div className="bg-purple-100 border border-purple-300 rounded p-4 text-purple-900 my-4 animate-fade-in">
          <strong>Roadmap Adjustment:</strong> {conflictResult}
        </div>
      )}
      {pitchDeck && (
        <div className="border-2 border-blue-200 rounded-2xl p-6 bg-blue-50 mt-6 shadow-lg animate-fade-in">
          <h3 className="font-bold text-xl mb-4 text-blue-700 flex items-center gap-2">📊 Pitch Deck</h3>
          <PitchDeckViewer pitchDeck={pitchDeck} />
        </div>
      )}
      {moodboard && (
        <MoodboardDialog moodboard={moodboard} onClose={() => setMoodboard(null)} />
      )}
      {qa && (
        <InvestorQADialog qa={qa} onClose={() => setQA(null)} />
      )}
      {riskmap && (
        <RiskMapDialog riskmap={riskmap} onClose={() => setRiskmap(null)} />
      )}
    </div>
  );
}
