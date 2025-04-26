import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import IdeaSetup from './pages/IdeaSetup';
import Simulation from './pages/Simulation';
import Outcome from './pages/Outcome';

function AppRoutes() {
  const [session, setSession] = useState(null);
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  const handleStart = (sessionData) => {
    setSession(sessionData);
    navigate('/simulation');
  };
  const handleOutcome = (reportData) => {
    setReport(reportData);
    navigate('/outcome');
  };
  const handleRestart = () => {
    setSession(null);
    setReport(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<IdeaSetup onStart={handleStart} />} />
      <Route path="/simulation" element={<Simulation session={session} onOutcome={handleOutcome} />} />
      <Route path="/outcome" element={<Outcome report={report} onRestart={handleRestart} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
