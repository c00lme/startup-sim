import React from 'react';

export default function ReportSummary({ report }) {
  // Placeholder: structure for report summary
  return (
    <div className="bg-gray-50 p-4 rounded mb-4">
      <h3 className="font-bold mb-2">Key Takeaways</h3>
      <ul className="mb-2">
        <li>• (Sample) The team aligned on MVP scope.</li>
        <li>• (Sample) Investor raised concerns about market size.</li>
      </ul>
      <h3 className="font-bold mb-2">SWOT Analysis</h3>
      <ul className="mb-2">
        <li>Strengths: (Sample) Strong technical team</li>
        <li>Weaknesses: (Sample) Unclear go-to-market</li>
        <li>Opportunities: (Sample) Growing sector</li>
        <li>Threats: (Sample) Competition</li>
      </ul>
      <h3 className="font-bold mb-2">MVP Suggestion</h3>
      <p>(Sample) Build a landing page and waitlist.</p>
      <h3 className="font-bold mb-2">Role-specific Concerns</h3>
      <ul className="mb-2">
        <li>CTO: (Sample) Tech stack risk</li>
        <li>Investor: (Sample) Monetization unclear</li>
      </ul>
      <h3 className="font-bold mb-2">Final Team Decision & Next Steps</h3>
      <p>(Sample) Proceed with MVP, revisit funding in 1 month.</p>
    </div>
  );
}
