// skills/page.js
"use client";


import { PageShell } from "../../components/page-shell";

export default function SkillsPage() {
  return (
    <PageShell eyebrow="Skills" title="Skills tracker" description="Use this area to log deliberate practice, certifications, portfolio work, and role-specific learning.">
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
          --blue: #5b9cf6;
          --radius: 10px;
          --radius-lg: 16px;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .skills-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
        }

        .skills-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .skill-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }

        .skill-item:last-child {
          border-bottom: none;
        }

        .skill-name {
          font-size: 14px;
          font-weight: 500;
        }

        .skill-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-bar {
          width: 120px;
          height: 6px;
          background: var(--bg3);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--amber);
          border-radius: 3px;
        }

        .skill-percent {
          font-size: 12px;
          color: var(--text2);
          min-width: 40px;
          text-align: right;
        }

        .skill-tag {
          display: inline-block;
          padding: 4px 8px;
          background: var(--amber-dim);
          border-radius: 6px;
          font-size: 11px;
          color: var(--amber);
          margin-top: 8px;
        }

        .log-entry {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .log-date {
          font-size: 11px;
          color: var(--text3);
          min-width: 80px;
        }

        .log-text {
          font-size: 13px;
          color: var(--text2);
          flex: 1;
        }

        .add-skill-btn {
          width: 100%;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 10px;
          color: var(--text2);
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          cursor: pointer;
          margin-top: 16px;
          transition: all 0.2s;
        }

        .add-skill-btn:hover {
          border-color: var(--amber);
          color: var(--amber);
        }

        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="skills-grid">
        <div className="skills-card">
          <h2>Current Skills</h2>
          <div className="skill-item">
            <span className="skill-name">Product Management</span>
            <div className="skill-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '78%' }} />
              </div>
              <span className="skill-percent">78%</span>
            </div>
          </div>
          <div className="skill-item">
            <span className="skill-name">Agile Methodologies</span>
            <div className="skill-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }} />
              </div>
              <span className="skill-percent">65%</span>
            </div>
          </div>
          <div className="skill-item">
            <span className="skill-name">Data Analysis</span>
            <div className="skill-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '52%' }} />
              </div>
              <span className="skill-percent">52%</span>
            </div>
          </div>
          <div className="skill-item">
            <span className="skill-name">Technical Writing</span>
            <div className="skill-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '70%' }} />
              </div>
              <span className="skill-percent">70%</span>
            </div>
          </div>
          <button className="add-skill-btn">+ Add new skill</button>
        </div>

        <div className="skills-card">
          <h2>Recent Activity</h2>
          <div className="log-entry">
            <div className="log-date">Mar 25</div>
            <div className="log-text">Completed Product-Strategy module on Coursera</div>
            <span className="skill-tag">+12 XP</span>
          </div>
          <div className="log-entry">
            <div className="log-date">Mar 24</div>
            <div className="log-text">Updated PM portfolio with 2 new case studies</div>
            <span className="skill-tag">+8 XP</span>
          </div>
          <div className="log-entry">
            <div className="log-date">Mar 23</div>
            <div className="log-text">Completed mock interview with peer</div>
            <span className="skill-tag">+15 XP</span>
          </div>
          <div className="log-entry">
            <div className="log-date">Mar 22</div>
            <div className="log-text">Read Inspired by Marty Cagan (Ch 1-5)</div>
            <span className="skill-tag">+5 XP</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}