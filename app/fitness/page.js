// fitness/page.js
"use client";

import { PageShell } from "../../components/page-shell";

export default function FitnessPage() {
  return (
    <PageShell eyebrow="Health" title="Fitness and habits" description="Track the routines that protect execution quality, focus, and energy over a multi-year plan.">
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
          --radius: 10px;
          --radius-lg: 16px;
        }

        .fitness-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .stats-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
        }

        .stats-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }

        .metric-row:last-child {
          border-bottom: none;
        }

        .metric-label {
          font-size: 14px;
          color: var(--text2);
        }

        .metric-value {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          color: var(--amber);
        }

        .metric-value.green {
          color: var(--green);
        }

        .habit-list {
          margin-top: 16px;
        }

        .habit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .habit-check {
          width: 20px;
          height: 20px;
          border-radius: 5px;
          border: 2px solid var(--border2);
          cursor: pointer;
        }

        .habit-check.completed {
          background: var(--green);
          border-color: var(--green);
          position: relative;
        }

        .habit-check.completed::after {
          content: '✓';
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
        }

        .habit-name {
          flex: 1;
          font-size: 14px;
        }

        .habit-streak {
          font-size: 12px;
          color: var(--amber);
        }

        @media (max-width: 768px) {
          .fitness-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="fitness-container">
        <div className="stats-card">
          <h2>Weekly Activity</h2>
          <div className="metric-row">
            <span className="metric-label">This weeks workouts</span>
            <span className="metric-value">3 / 5</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Active minutes</span>
            <span className="metric-value">187 min</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Calories burned</span>
            <span className="metric-value">1,243</span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Rest days</span>
            <span className="metric-value green">2</span>
          </div>
        </div>

        <div className="stats-card">
          <h2>Daily Habits</h2>
          <div className="habit-list">
            <div className="habit-item">
              <div className="habit-check completed"></div>
              <span className="habit-name">Morning run (3km)</span>
              <span className="habit-streak">🔥 11 day streak</span>
            </div>
            <div className="habit-item">
              <div className="habit-check"></div>
              <span className="habit-name">Stretching (10 min)</span>
              <span className="habit-streak">3 day streak</span>
            </div>
            <div className="habit-item">
              <div className="habit-check completed"></div>
              <span className="habit-name">Hydration (2L water)</span>
              <span className="habit-streak">8 day streak</span>
            </div>
            <div className="habit-item">
              <div className="habit-check"></div>
              <span className="habit-name">Sleep before 11pm</span>
              <span className="habit-streak">4 day streak</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}