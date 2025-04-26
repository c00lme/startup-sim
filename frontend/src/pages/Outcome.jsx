import React from 'react';
import ReportSummary from '../components/ReportSummary';

export default function Outcome({ report, onRestart }) {
  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Session Outcome</h2>
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
    </div>
  );
}
