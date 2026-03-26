"use client";

import { useState, useEffect } from "react";
import { PageShell } from "../../components/page-shell";

export default function WeeklyReviewPage() {
  const [form, setForm] = useState({ wins: "", blockers: "", metrics: "" });
  const [review, setReview] = useState("");
  const [progress, setProgress] = useState({ score: {} });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch progress data for the dashboard-style display
    fetch("/api/progress")
      .then((response) => response.json())
      .then(setProgress)
      .catch(() => {});
  }, []);

  const score = progress.score || {};
  const totalScore = Math.round(score.totalScore || 72);
  const tasksCompleted = score.tasks_completed_week || 24;
  const totalTasksWeek = score.total_tasks_week || 30;
  const applicationsSent = score.applications_this_week || 5;
  
  // Dimension breakdown with weights
  const dimensions = [
    { name: "Skills", value: score.skills_score || 78, weight: 0.30, color: "#5b9cf6" },
    { name: "Applications", value: score.applications_score || 65, weight: 0.25, color: "#e8a830" },
    { name: "Communication", value: score.communication_score || 42, weight: 0.15, color: "#e06060" },
    { name: "Health", value: score.health_score || 60, weight: 0.10, color: "#4dbb8a" },
    { name: "Environment", value: score.environment_score || 70, weight: 0.10, color: "#5b9cf6" },
    { name: "Consistency", value: score.consistency_score || 70, weight: 0.10, color: "#4dbb8a" },
  ];

  async function submit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/weekly-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, progress: score }),
      });
      const data = await response.json();
      setReview(data.review || data.error || "");
    } catch (error) {
      setReview("Unable to generate review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Get week range based on current date
  const getWeekRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return `${formatDate(startOfWeek)}–${formatDate(endOfWeek)}, ${now.getFullYear()}`;
  };

  return (
    <PageShell 
      eyebrow="Weekly Review" 
      title="AI-generated review and recommendations" 
      description="Summarize the week and get practical next-step guidance tied to your BrightPath context."
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
          --amber2: #f2bc52;
          --amber-dim: rgba(232,168,48,0.12);
          --green: #4dbb8a;
          --green-dim: rgba(77,187,138,0.12);
          --red: #e06060;
          --red-dim: rgba(224,96,96,0.12);
          --blue: #5b9cf6;
          --blue-dim: rgba(91,156,246,0.12);
          --radius: 10px;
          --radius-lg: 16px;
        }

        .weekly-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        /* Review Hero Section */
        .review-hero {
          background: linear-gradient(135deg, var(--bg2) 0%, rgba(232,168,48,0.05) 100%);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .review-hero::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 200px;
          height: 200px;
          background: radial-gradient(ellipse, rgba(232,168,48,0.07), transparent 70%);
          pointer-events: none;
        }

        .week-range {
          font-size: 12px;
          color: var(--amber);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .review-hero h2 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .review-hero p {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.6;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          text-align: center;
        }

        .stat-label {
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 12px;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: var(--amber);
        }

        .stat-change {
          font-size: 12px;
          margin-top: 8px;
          color: var(--green);
        }

        .stat-change.neutral {
          color: var(--text3);
        }

        /* Dimension Breakdown */
        .dim-breakdown {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 32px;
        }

        .dim-breakdown h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .dim-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
        }

        .dim-row:last-child {
          border-bottom: none;
        }

        .dim-name {
          width: 140px;
          font-size: 14px;
          color: var(--text2);
          flex-shrink: 0;
        }

        .dim-name .weight {
          font-size: 10px;
          color: var(--text3);
          margin-left: 4px;
        }

        .dim-bar-bg {
          flex: 1;
          background: var(--bg3);
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
        }

        .dim-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .dim-pct {
          width: 48px;
          text-align: right;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        /* Form Section */
        .form-section {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 32px;
        }

        .form-section h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          color: var(--text2);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group textarea {
          width: 100%;
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: var(--radius);
          padding: 12px;
          color: var(--text);
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          resize: vertical;
          min-height: 100px;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group textarea:focus {
          border-color: var(--amber);
        }

        .generate-btn {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .generate-btn:hover:not(:disabled) {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Review Output */
        .review-output {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .review-output h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          margin-bottom: 16px;
        }

        .review-output .ai-badge {
          display: inline-block;
          background: var(--amber-dim);
          border: 1px solid rgba(232,168,48,0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          color: var(--amber);
          margin-bottom: 16px;
        }

        .review-content {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .recommendations {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .recommendations h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--amber);
        }

        .reco-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reco-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: var(--text2);
          line-height: 1.5;
        }

        .reco-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--amber);
          margin-top: 6px;
          flex-shrink: 0;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .dim-row {
            flex-wrap: wrap;
          }
          .dim-name {
            width: 100%;
            margin-bottom: 8px;
          }
          .dim-bar-bg {
            width: 100%;
            order: 1;
          }
        }
      `}</style>

      <div className="weekly-container">
        {/* Hero Section */}
        <div className="review-hero">
          <div className="week-range">{getWeekRange()}</div>
          <h2>Week 10 Review</h2>
          <p>Heres how you performed across all dimensions this week.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">SUCCESS SCORE</div>
            <div className="stat-number">{totalScore}</div>
            <div className="stat-change">▲ +4 from last week</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">TASKS COMPLETED</div>
            <div className="stat-number">{tasksCompleted} / {totalTasksWeek}</div>
            <div className="stat-change">{Math.round((tasksCompleted / totalTasksWeek) * 100)}% completion rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">APPLICATIONS SENT</div>
            <div className="stat-number">{applicationsSent}</div>
            <div className="stat-change neutral">= same as last week</div>
          </div>
        </div>

        {/* Dimension Breakdown */}
        <div className="dim-breakdown">
          <h3>Dimension Breakdown</h3>
          {dimensions.map((dim) => (
            <div key={dim.name} className="dim-row">
              <div className="dim-name">
                {dim.name} <span className="weight">(×{dim.weight})</span>
              </div>
              <div className="dim-bar-bg">
                <div 
                  className="dim-bar" 
                  style={{ width: `${dim.value}%`, background: dim.color }}
                />
              </div>
              <div className="dim-pct" style={{ color: dim.value < 50 ? 'var(--red)' : dim.color }}>
                {dim.value}%
              </div>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="form-section">
          <h3>Share Your Week</h3>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>What went well this week? (Wins)</label>
              <textarea 
                value={form.wins} 
                onChange={(event) => setForm({ ...form, wins: event.target.value })}
                placeholder="e.g., Completed 3 job applications, finished Coursera module, ran 4 times..."
              />
            </div>
            <div className="form-group">
              <label>What held you back? (Blockers)</label>
              <textarea 
                value={form.blockers} 
                onChange={(event) => setForm({ ...form, blockers: event.target.value })}
                placeholder="e.g., Lost motivation mid-week, struggled with networking, poor sleep..."
              />
            </div>
            <div className="form-group">
              <label>Key Metrics & Observations</label>
              <textarea 
                value={form.metrics} 
                onChange={(event) => setForm({ ...form, metrics: event.target.value })}
                placeholder="e.g., 5 applications, 2 interviews scheduled, 80% task completion..."
              />
            </div>
            <button type="submit" className="generate-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner" />
                  Generating...
                </>
              ) : (
                "Generate AI Review →"
              )}
            </button>
          </form>
        </div>

        {/* Review Output */}
        <div className="review-output">
          <h3>AI Weekly Summary</h3>
          <span className="ai-badge">Powered by Groq</span>
          <div className="review-content">
            {review ? (
              <>{review}</>
            ) : (
              <p>Submit your week summary to generate an AI-powered review with personalized recommendations.</p>
            )}
          </div>
          
          {review && (
            <div className="recommendations">
              <h4>📋 AI-Generated Recommendations</h4>
              <div className="reco-list">
                <div className="reco-item">
                  <div className="reco-dot" />
                  <span>Focus on Communication dimension this week — its your lowest-scoring category</span>
                </div>
                <div className="reco-item">
                  <div className="reco-dot" />
                  <span>Schedule 15 minutes daily for networking or practice conversations</span>
                </div>
                <div className="reco-item">
                  <div className="reco-dot" />
                  <span>Maintain your application momentum — consistency drives results</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}