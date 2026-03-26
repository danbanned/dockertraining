// settings/page.js
"use client";

import { PageShell } from "../../components/page-shell";

export default function SettingsPage() {
  return (
    <PageShell eyebrow="Settings" title="Account and runtime settings" description="Configure API keys, user profile inputs, and environment-specific deployment values.">
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

        .settings-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .settings-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
        }

        .settings-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .settings-group {
          margin-bottom: 24px;
        }

        .settings-group label {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text3);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .settings-input {
          width: 100%;
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: var(--radius);
          padding: 10px 12px;
          color: var(--text);
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          transition: border-color 0.2s;
        }

        .settings-input:focus {
          outline: none;
          border-color: var(--amber);
        }

        .settings-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          background: var(--green);
          color: #000;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          margin-left: 8px;
        }

        .status-badge.warning {
          background: var(--amber);
        }

        .save-btn {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          margin-top: 16px;
          transition: all 0.2s;
        }

        .save-btn:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        .info-text {
          font-size: 12px;
          color: var(--text3);
          margin-top: 6px;
        }

        @media (max-width: 768px) {
          .settings-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="settings-container">
        <div className="settings-card">
          <h2>Account Settings</h2>
          <div className="settings-group">
            <label>Email Address</label>
            <input className="settings-input" type="email" defaultValue="marcus.chen@example.com" />
          </div>
          <div className="settings-group">
            <label>Display Name</label>
            <input className="settings-input" type="text" defaultValue="Marcus Chen" />
          </div>
          <div className="settings-group">
            <label>Timezone</label>
            <input className="settings-input" type="text" defaultValue="America/Chicago" />
          </div>
          <button className="save-btn">Save Changes</button>
        </div>

        <div className="settings-card">
          <h2>API Configuration</h2>
          <div className="settings-group">
            <label>Groq API Key <span className="status-badge">Active</span></label>
            <input className="settings-input" type="password" defaultValue="••••••••••••••••" />
            <div className="info-text">Primary AI provider for fast responses</div>
          </div>
          <div className="settings-group">
            <label>Gemini API Key <span className="status-badge">Active</span></label>
            <input className="settings-input" type="password" defaultValue="••••••••••••••••" />
            <div className="info-text">Fallback provider for complex queries</div>
          </div>
          <div className="settings-group">
            <label>Ollama URL <span className="status-badge warning">Offline Mode</span></label>
            <input className="settings-input" type="text" defaultValue="http://localhost:11434" />
            <div className="info-text">Local model for offline fallback</div>
          </div>
          <button className="save-btn">Test Connection</button>
        </div>

        <div className="settings-card">
          <h2>Preferences</h2>
          <div className="settings-group">
            <label>Notification Frequency</label>
            <select className="settings-input">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Real-time</option>
            </select>
          </div>
          <div className="settings-group">
            <label>Email Reminders</label>
            <select className="settings-input">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
          <div className="settings-group">
            <label>Theme</label>
            <select className="settings-input">
              <option>Dark</option>
              <option>Light</option>
              <option>System</option>
            </select>
          </div>
          <button className="save-btn">Save Preferences</button>
        </div>

        <div className="settings-card">
          <h2>Data & Export</h2>
          <div className="settings-group">
            <label>Export Your Data</label>
            <button className="save-btn" style={{ background: 'var(--bg3)', color: 'var(--text2)' }}>Download JSON</button>
            <div className="info-text">Export all your progress, tasks, and applications</div>
          </div>
          <div className="settings-group">
            <label>Delete Account</label>
            <button className="save-btn" style={{ background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid var(--red)' }}>Delete Account</button>
            <div className="info-text">This action cannot be undone</div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}