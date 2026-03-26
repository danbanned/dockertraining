"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/page-shell";

function renderInlineFormatting(text) {
  const parts = String(text || "").split("**");

  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>
  );
}

function renderDescription(text) {
  if (!text) {
    return null;
  }

  // Split into paragraphs by double newlines
  const sections = String(text)
    .split(/\n\s*\n/)
    .map((section) => section.trim())
    .filter(Boolean);

  return sections.map((section, index) => (
    <p key={index} className="roadmap-description-block">
      {renderInlineFormatting(section)}
    </p>
  ));
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/roadmap");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch roadmap: ${response.status}`);
      }
      
      const data = await response.json();
      setRoadmap(data.roadmap);
      setError(null);
    } catch (err) {
      console.error("Error fetching roadmap:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <PageShell 
        eyebrow="Roadmap" 
        title="Your generated 3-year plan" 
        description="The engine sets milestones. AI explains them and turns them into a readable path."
      >
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 20px;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid var(--border);
            border-top-color: var(--amber);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-text {
            color: var(--text2);
            font-size: 14px;
          }
        `}</style>
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">Generating your personalized roadmap...</div>
        </div>
      </PageShell>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageShell 
        eyebrow="Roadmap" 
        title="Your generated 3-year plan" 
        description="The engine sets milestones. AI explains them and turns them into a readable path."
      >
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
            text-align: center;
          }
          .error-icon {
            font-size: 48px;
          }
          .error-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--red);
          }
          .error-message {
            color: var(--text2);
            margin-bottom: 24px;
          }
          .retry-btn {
            background: var(--amber);
            color: #000;
            border: none;
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Sora', sans-serif;
          }
        `}</style>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Unable to load roadmap</div>
          <div className="error-message">{error}</div>
          <button className="retry-btn" onClick={fetchRoadmap}>Try Again</button>
        </div>
      </PageShell>
    );
  }

  // Show empty state (no roadmap generated yet)
  if (!roadmap || (!roadmap.title && (!roadmap.steps || roadmap.steps.length === 0))) {
    return (
      <PageShell 
        eyebrow="Roadmap" 
        title="Your generated 3-year plan" 
        description="The engine sets milestones. AI explains them and turns them into a readable path."
      >
        <style jsx>{`
          .empty-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
            text-align: center;
          }
          .empty-icon {
            font-size: 48px;
          }
          .empty-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--amber);
          }
          .empty-message {
            color: var(--text2);
            max-width: 400px;
            margin-bottom: 24px;
          }
          .generate-btn {
            background: var(--amber);
            color: #000;
            border: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Sora', sans-serif;
            font-size: 14px;
          }
        `}</style>
        <div className="empty-container">
          <div className="empty-icon">🗺️</div>
          <div className="empty-title">No roadmap yet</div>
          <div className="empty-message">
            Complete onboarding and generate your personalized 3-year roadmap to see your milestones here.
          </div>
          <button 
            className="generate-btn" 
            onClick={() => window.location.href = '/onboarding'}
          >
            Start Onboarding →
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell 
      eyebrow="Roadmap" 
      title="Your generated 3-year plan" 
      description="The engine sets milestones. AI explains them and turns them into a readable path."
    >
      <style jsx>{`
        :global(:root) {
          --bg: #0a0a0a;
          --bg2: #111;
          --bg3: #181818;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.13);
          --text: #f2ede4;
          --text2: #a09890;
          --text3: #6b6560;
          --amber: #e8a830;
          --amber-dim: rgba(232,168,48,0.12);
          --green: #4dbb8a;
          --green-dim: rgba(77,187,138,0.12);
          --blue: #5b9cf6;
          --blue-dim: rgba(91,156,246,0.12);
          --radius: 10px;
          --radius-lg: 16px;
        }

        .roadmap-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .roadmap-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .roadmap-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--amber);
        }

        .roadmap-header .subtitle {
          font-size: 16px;
          color: var(--text2);
          line-height: 1.6;
        }

        .timeline {
          position: relative;
          padding-left: 40px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--amber), var(--border));
        }

        .milestone-card {
          position: relative;
          margin-bottom: 48px;
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
          transition: all 0.3s;
        }

        .milestone-card:hover {
          border-color: var(--border2);
          transform: translateX(4px);
        }

        .milestone-dot {
          position: absolute;
          left: -55px;
          top: 32px;
          width: 32px;
          height: 32px;
          background: var(--amber);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #000;
          font-size: 12px;
          border: 2px solid var(--bg);
          box-shadow: 0 0 0 2px var(--amber);
        }

        .milestone-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .milestone-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: var(--amber);
        }

        .milestone-date {
          font-size: 13px;
          color: var(--text3);
          background: var(--bg3);
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid var(--border);
        }

        .milestone-goal {
          display: inline-block;
          background: var(--amber-dim);
          border: 1px solid rgba(232,168,48,0.3);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          color: var(--amber);
          margin-bottom: 16px;
        }

        .milestone-description {
          color: var(--text2);
          line-height: 1.7;
          font-size: 14px;
        }

        .milestone-description p {
          margin-bottom: 12px;
        }

        .milestone-description p:last-child {
          margin-bottom: 0;
        }

        .roadmap-description {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
          margin-bottom: 32px;
        }

        .roadmap-description h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          margin-bottom: 20px;
          color: var(--amber);
        }

        .roadmap-description p {
          color: var(--text2);
          line-height: 1.8;
          font-size: 15px;
          margin-bottom: 20px;
        }

        .roadmap-description p:last-child {
          margin-bottom: 0;
        }

        .roadmap-description strong {
          color: var(--amber);
          font-weight: 600;
        }

        .progress-section {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-top: 32px;
        }

        .progress-section h3 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          margin-bottom: 20px;
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .progress-bar-bg {
          flex: 1;
          height: 8px;
          background: var(--bg3);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--amber);
          border-radius: 4px;
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 13px;
          color: var(--text2);
          min-width: 80px;
        }

        @media (max-width: 768px) {
          .timeline {
            padding-left: 20px;
          }
          .timeline::before {
            left: -5px;
          }
          .milestone-dot {
            left: -35px;
            width: 24px;
            height: 24px;
            font-size: 10px;
            top: 24px;
          }
          .milestone-title {
            font-size: 18px;
          }
          .roadmap-header h1 {
            font-size: 24px;
          }
          .roadmap-description p {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="roadmap-container">
        <div className="roadmap-header">
          <h1>{roadmap.title || "BrightPath 3-Year Acceleration Plan"}</h1>
          <div className="subtitle">
            {roadmap.subtitle || "A structured journey to achieve holistic growth across career, income, health, and personal development"}
          </div>
        </div>

        {/* Full Description - From API response */}
        {roadmap.description && (
          <div className="roadmap-description">
            <h2>Your Journey Ahead</h2>
            {renderDescription(roadmap.description)}
          </div>
        )}

        {/* Timeline Milestones - From API response */}
        <div className="timeline">
          {(roadmap.steps || []).map((step, index) => (
            <div key={step.id || step.month || index} className="milestone-card">
              <div className="milestone-dot">{step.month || index + 1}</div>
              <div className="milestone-header">
                <div className="milestone-title">
                  {step.title || `Milestone ${index + 1}`}
                </div>
                {step.targetDate && (
                  <div className="milestone-date">Target: {step.targetDate}</div>
                )}
              </div>
              {step.goal && (
                <div className="milestone-goal">
                  🎯 Goal: {step.goal}
                </div>
              )}
              {step.description && (
                <div className="milestone-description">
                  {renderDescription(step.description)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <h3>Overall Progress</h3>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${Math.min(100, (roadmap.steps?.filter(s => s.completed).length / (roadmap.steps?.length || 6)) * 100 || 0)}%` }}
              />
            </div>
            <div className="progress-text">
              {roadmap.steps?.filter(s => s.completed).length || 0} / {roadmap.steps?.length || 0} Milestones
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text3)' }}>
            Stay on track by completing tasks aligned with each milestone. Your progress updates automatically as you log achievements.
          </div>
        </div>
      </div>
    </PageShell>
  );
}