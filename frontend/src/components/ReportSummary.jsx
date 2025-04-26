import React from 'react';

export default function ReportSummary({ report }) {
  return (
    <div className="bg-gray-50 p-4 rounded mb-4">
      <h3 className="font-bold mb-2">Executive Summary</h3>
      <div className="whitespace-pre-wrap text-gray-800">
        {report.summary}
      </div>
    </div>
  );
}
