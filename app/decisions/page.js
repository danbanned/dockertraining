// decisions/page.js
"use client";

import { useState } from "react";
import { PageShell } from "../../components/page-shell";

export default function DecisionsPage() {
  const [decisionPrompt, setDecisionPrompt] = useState("");
  const [advice, setAdvice] = useState("");

  async function submit(event) {
    event.preventDefault();
    const response = await fetch("/api/ai/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decisionPrompt,
        userContext: { area: "career and life acceleration" },
      }),
    });
    const data = await response.json();
    setAdvice(data.advice || data.error || "");
  }

  return (
    <PageShell eyebrow="Decisions" title="AI-powered decision support" description="Feed a decision into BrightPath and get a recommendation, tradeoffs, and the next best action.">
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
          --radius: 10px;
          --radius-lg: 16px;
        }

        .decisions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .form-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
        }

        .form-card h2 {
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
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text3);
          margin-bottom: 8px;
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
          min-height: 150px;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: var(--amber);
        }

        .submit-btn {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        .panel {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px;
        }

        .panel h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          margin-bottom: 16px;
        }

        .panel p {
          color: var(--text2);
          line-height: 1.6;
          white-space: pre-wrap;
        }

        @media (max-width: 768px) {
          .decisions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="decisions-grid">
        <section className="form-card">
          <h2>Ask BrightPath</h2>
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Decision prompt</label>
              <textarea 
                value={decisionPrompt} 
                onChange={(event) => setDecisionPrompt(event.target.value)}
                placeholder="E.g., Should I take the product manager role at the startup or wait for a larger company? What tradeoffs should I consider?"
              />
            </div>
            <button type="submit" className="submit-btn">Get advice →</button>
          </form>
        </section>
        
        <section className="panel">
          <h2>AI Recommendation</h2>
          <p>{advice || "Ask about a move, opportunity, tradeoff, or timing decision. BrightPath will analyze your context and provide structured advice."}</p>
        </section>
      </div>
    </PageShell>
  );
}