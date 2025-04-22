import React, { useState } from 'react';
import './SystemLanding.css';

const SystemLanding: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { sender: 'user' | 'bot'; message: string }[]
  >([]);

  const predefinedQuestions = [
    "How does the System work?",
    "What are Daily Quests?",
    "How do I level up?",
    "What if I miss a day?",
  ];

  const dungeonResponses: Record<string, string> = {
    "How does the System work?":
      "⚙️ The System binds your habits to daily quests. Complete them, and your stats rise.",
    "What are Daily Quests?":
      "📜 Daily Quests are tasks you assign yourself. They appear each day—complete them to gain XP.",
    "How do I level up?":
      "🆙 With each completed quest, your progress bar fills. Reach the top to ascend in rank!",
    "What if I miss a day?":
      "💤 A missed quest? Fear not, adventurer. But beware—consistency is the true path to power.",
  };

  const handleQuestionClick = (question: string) => {
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', message: question },
      { sender: 'bot', message: dungeonResponses[question] || "🧩 The Oracle is unsure... try again." },
    ]);
  };

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logoo.png" alt="System Logo" className="logo" />
          <span className="project-name">Hunter's Log</span>
          <div className="nav-links">
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
              About
            </button>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              Features
            </button>
          </div>
        </div>
        <div className="navbar-right">
          <button onClick={() => window.location.href = '/login'}>Sign In</button>
          <button onClick={() => window.location.href = '/register'}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="overlay" />
        <header className="header">
          <h1>LEVEL UP YOUR LIFE WITH SYSTEM</h1>
          <p>
            Transform your daily habits into power-leveling quests. Just like Sung
            Jin-Woo, become the strongest version of yourself through consistent
            growth and dedication.
          </p>
          <button className="start-button" onClick={() => window.location.href = '/login'}>
            START YOUR JOURNEY
          </button>
        </header>
      </section>

      {/* Features Section */}
      <section className="hero2">
        <section className="how-it-works" id="features">
          <h2>HOW THE SYSTEM WORKS</h2>
          <div className="grid">
            <div className="card">
              <h3>DAILY QUESTS</h3>
              <p>
                Complete your daily habits as quests. Each completion strengthens
                your stats and earns rewards.
              </p>
            </div>
            <div className="card">
              <h3>TRACK YOUR STATS</h3>
              <p>
                Monitor your progress on detailed dashboards. Watch your consistency
                and discipline grow over time.
              </p>
            </div>
            <div className="card">
              <h3>EARN ACHIEVEMENTS</h3>
              <p>
                Unlock achievements and titles as you master your habits. Prove your
                dedication and showcase your progress.
              </p>
            </div>
            <div className="card">
              <h3>LEVEL UP</h3>
              <p>
                Advance the System as you conquer each challenge. Each habit completed
                brings you closer to evolving into your strongest self.
              </p>
            </div>
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="footer" id="about">
        <h2>READY TO BEGIN YOUR ASCENSION?</h2>
        <p>
          Take on new dailies and start transforming your habits now. Your journey to
          becoming the strongest version of yourself.
        </p>
        <button className="create-account" onClick={() => window.location.href = '/register'}>
          CREATE YOUR ACCOUNT
        </button>
      </footer>

      {/* Chatbot */}
      <div className="chatbot-container">
        <button className="chat-toggle" onClick={() => setChatOpen(!chatOpen)}>
          💬
        </button>
        {chatOpen && (
          <div className="chatbox">
            <h4>🧙 Dungeon Guide</h4>
            <ul>
              {predefinedQuestions.map((q, i) => (
                <li key={i}>
                  <button
                    className="chat-question"
                    onClick={() => handleQuestionClick(q)}
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
            <div className="chat-history">
              {chatHistory.map((msg, i) => (
                <p key={i} style={{ margin: '6px 0', color: msg.sender === 'bot' ? '#444' : '#1c7ed6' }}>
                  <strong>{msg.sender === 'bot' ? '🧙' : '🧑'}:</strong> {msg.message}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLanding;
