import React, { useState, useEffect } from 'react';
import ReportSummary from '../components/ReportSummary';
import PitchDeckViewer from '../components/PitchDeckViewer';
import ConflictDialog from '../components/ConflictDialog';
import InvestorQADialog from '../components/InvestorQADialog';
import RiskMapDialog from '../components/RiskMapDialog';
import AgentProfileCard from '../components/AgentProfileCard';
import Confetti from '../components/Confetti';
import { fetchPitchDeck, simulateConflict, resolveConflict, fetchInvestorQA, fetchRiskMap } from '../api';

export default function Outcome({ report, onRestart }) {
  const [pitchDeck, setPitchDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(null);
  const [conflictLoading, setConflictLoading] = useState(false);
  const [conflictResult, setConflictResult] = useState(null);
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
    <div className="max-w-4xl mx-auto mt-12 bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Glass morphism header section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
        
        <h2 className="text-3xl font-bold text-white mb-4 relative z-10">Session Outcome</h2>
        
        {/* Agent Profile Cards - Premium version */}
        <div className="flex justify-center gap-6 mb-4 relative z-10">
          <AgentProfileCard role="PM" />
          <AgentProfileCard role="CTO" />
          <AgentProfileCard role="Investor" />
        </div>
      </div>
      
      {/* Confetti effect */}
      <Confetti trigger={showConfetti} />
      
      {/* Content section */}
      <div className="p-8">
        {/* Report Summary */}
        {report && (
          <div className="mb-8 bg-gray-50 rounded-2xl p-6 shadow-md">
            <ReportSummary report={report} />
          </div>
        )}
        
        {/* Download PDF Button */}
        {report && report.report_url && (
          <a
            href={report.report_url}
            className="mb-8 block w-full text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 shadow-lg transition duration-300 transform hover:scale-[1.02]"
            download="business_report.pdf"
          >
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF Report
            </div>
          </a>
        )}
        
        {/* Action Buttons Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Generate Additional Resources</h3>
          
          {/* First row of buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="group relative flex items-center justify-center bg-white border border-indigo-200 h-20 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={handlePitchDeck}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-3 relative z-10 px-4 py-3 w-full h-full group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
                  {loading ? 'Generating...' : 'Pitch Deck'}
                </span>
              </div>
            </button>
            
            <button
              className="group relative flex items-center justify-center bg-white border border-yellow-200 h-20 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={handleSimulateConflict}
              disabled={conflictLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-3 relative z-10 px-4 py-3 w-full h-full group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
                  {conflictLoading ? 'Simulating...' : 'Simulate Conflict'}
                </span>
              </div>
            </button>
            
            <button
              className="group relative flex items-center justify-center bg-white border border-orange-200 h-20 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={handleQA}
              disabled={qaLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-3 relative z-10 px-4 py-3 w-full h-full group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
                  {qaLoading ? 'Simulating...' : 'Investor Q&A'}
                </span>
              </div>
            </button>
          </div>
          
          {/* Second row of buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="group relative flex items-center justify-center bg-white border border-green-200 h-20 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={handleRiskmap}
              disabled={riskmapLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-3 relative z-10 px-4 py-3 w-full h-full group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
                  {riskmapLoading ? 'Generating...' : 'Risk Map'}
                </span>
              </div>
            </button>
            
            <button
              className="group relative flex items-center justify-center bg-white border border-gray-200 h-20 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              onClick={onRestart}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center gap-3 relative z-10 px-4 py-3 w-full h-full group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-medium text-gray-800 group-hover:text-white transition-colors duration-300">
                  New Simulation
                </span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Conflict Dialog */}
        {conflict && (
          <ConflictDialog
            conflict={conflict}
            onDecision={handleResolveConflict}
            onClose={() => setConflict(null)}
            loading={conflictLoading}
          />
        )}
        
        {/* Conflict Resolution Result */}
        {conflictResult && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6 text-gray-800 shadow-md animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-purple-900 mb-1">Roadmap Adjustment</h4>
                <p className="text-gray-700">{conflictResult}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Pitch Deck Display */}
        {pitchDeck && (
          <div className="mt-8 border border-blue-200 rounded-2xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-blue-800">Pitch Deck</h3>
            </div>
            <PitchDeckViewer pitchDeck={pitchDeck} />
          </div>
        )}
        
        {/* Dialogs */}
        {qa && <InvestorQADialog qa={qa} onClose={() => setQA(null)} />}
        {riskmap && <RiskMapDialog riskmap={riskmap} onClose={() => setRiskmap(null)} />}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 py-4 px-8 text-center text-sm text-gray-500">
        Built with AI-driven business simulation technology
      </div>
    </div>
  );
}