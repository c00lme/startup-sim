import React from 'react';
import ReportSummary from '../components/ReportSummary';

export default function Outcome({ report, onRestart }) {
  return (
    <div className="max-w-3xl mx-auto mt-16 p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Simulation Outcome</h2>

      {report && (
        <div className="mb-8">
          <ReportSummary report={report} />
        </div>
      )}

      {report && report.report_url && (
        <a
          href={report.report_url}
          className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-full text-lg font-bold text-center shadow-md hover:shadow-lg transition-all mb-6"
          download="business_report.pdf"
        >
          Download PDF Report
        </a>
      )}

      <button
        className="w-full bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-800 font-bold py-3 rounded-full text-lg shadow-inner hover:shadow transition-all"
        onClick={onRestart}
      >
        Start New Simulation
      </button>
    </div>
  );
}
