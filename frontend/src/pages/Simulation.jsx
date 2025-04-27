import React, { useState, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";
import Controls from "../components/Controls";
import {
  sendAgentMessage,
  completeSession,
  fetchConversationFeed,
  startRoundtable,
} from "../api";
import { useRef } from "react";

export default function Simulation({ session, onOutcome }) {
  const postUser = async (message) => {
    const payload = {
      agent: "User",
      sender: "User",
      message: message,
    };

    const BACKEND_URL = "http://127.0.0.1:5000/api/agent-comment";
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // <-- This tells the server you're sending JSON
      },
      body: JSON.stringify(payload),
    });
  };
  const [messages, setMessages] = useState([
    { sender: "PM", text: "Welcome to the simulation." },
  ]);
  const [paused, setPaused] = useState(false);
  const [inputLoading, setInputLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const feed = await fetchConversationFeed();
        setMessages(
          feed.comments.map((c) => ({ sender: c.agent, text: c.message }))
        );
      } catch (e) {
        // ignore fetch errors
      }
    }, 1500);

    // Cleanup function to clear the interval when the component unmounts or re-renders
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  if (!session)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            No Active Session
          </h2>
          <p className="text-gray-600">
            Please start a new simulation to continue.
          </p>
        </div>
      </div>
    );

  const handleInject = async (input) => {
    setInputLoading(true);
    setError("");

    console.log("posting user");
    console.log("done");
    try {
      await postUser(input);
      // setMessages((msgs) => [...msgs, { sender: "User", text: input }]);
      await startRoundtable(input);
      setShowTooltip(true);
    } catch (e) {
      setError("Server error. Please try again.");
    } finally {
      setInputLoading(false);
    }
  };

  const handleClarify = () => handleInject("Clarification from user.");

  const handleEnd = async () => {
    setInputLoading(true);
    setError("");
    try {
      const res = await completeSession({
        sessionId: session.sessionId,
        messages,
      });
      onOutcome({ ...res, messages });
    } catch (e) {
      setError("Could not complete session. Please try again.");
    } finally {
      setInputLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3 tracking-tight">
            Startup Simulation
          </h2>
          <p className="text-indigo-700 text-xl font-medium">
            AI Agent Roundtable
          </p>

          {/* Session Info Badge */}
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-purple-100">
            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-2"></span>
            <span className="text-sm font-medium text-gray-700">
              Session: {session.sessionId.substring(0, 8)}...
            </span>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-purple-100 transition-all duration-300 hover:shadow-2xl">
          <div className="p-5 bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-purple-100 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
              Agent Conversation
            </h3>
            <div className="flex items-center space-x-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-indigo-700">
                Live Session
              </span>
            </div>
          </div>
          <div className="h-[500px] p-4 overflow-y-auto bg-gradient-to-b from-white/80 to-white/60">
            <ChatWindow messages={messages} />
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-purple-100 p-6 transition-all duration-300 hover:shadow-2xl">
          <Controls
            paused={paused}
            setPaused={setPaused}
            onInject={handleInject}
            onClarify={handleClarify}
            onEnd={handleEnd}
          />

          {showTooltip && (
            <div className="flex items-center justify-center mt-4 text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-100 animate-fade-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Message sent successfully! Agents are responding...
            </div>
          )}

          {inputLoading && (
            <div className="flex items-center justify-center mt-4 text-indigo-700 bg-indigo-50 p-3 rounded-xl border border-indigo-100 animate-pulse">
              <svg
                className="animate-spin mr-3 h-5 w-5 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing your request...
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 mt-4 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Footer Information */}
        <div className="text-center text-sm text-gray-500 mt-6">
          <p>© 2025 Startup Simulator • AI-Powered Business Simulation</p>
        </div>
      </div>
    </div>
  );
}
