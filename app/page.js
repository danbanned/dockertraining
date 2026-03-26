// page.js (Home)
"use client";

import Link from "next/link";
import { PageShell } from "../components/page-shell";

export default function HomePage() {
  return (
    <PageShell
      eyebrow="AI-guided execution"
      title="BrightPath turns ambition into a concrete operating plan."
      description="Generate a multi-year roadmap, focus the day on the right levers, and keep career, income, health, and communication progress moving together."
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
          --radius: 10px;
          --radius-lg: 16px;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 64px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border2);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          color: var(--text2);
          margin-bottom: 32px;
        }

        .hero-badge span {
          width: 6px;
          height: 6px;
          background: var(--green);
          border-radius: 50%;
        }

        .hero-section h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 700;
          line-height: 1.1;
          max-width: 780px;
          margin: 0 auto 20px;
        }

        .hero-section h1 em {
          color: var(--amber);
          font-style: italic;
        }

        .hero-section p {
          font-size: 18px;
          color: var(--text2);
          max-width: 520px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
          justify-content: center;
          margin-top: 48px;
          flex-wrap: wrap;
        }

        .hero-stat {
          text-align: center;
        }

        .hero-stat .num {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: var(--amber);
        }

        .hero-stat .lbl {
          font-size: 12px;
          color: var(--text3);
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .hero-divider {
          width: 1px;
          background: var(--border);
          align-self: stretch;
        }

        .grid-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .panel {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
        }

        .panel h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          margin-bottom: 16px;
        }

        .panel p {
          color: var(--text2);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .button-row {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        .btn-outline {
          background: none;
          border: 1px solid var(--border2);
          color: var(--text);
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          border-color: var(--amber);
          color: var(--amber);
        }

        .stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .list-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
        }

        .list-row strong {
          color: var(--text);
        }

        .list-row span {
          color: var(--text2);
        }

        @media (max-width: 768px) {
          .grid-two {
            grid-template-columns: 1fr;
          }
          .hero-stats {
            gap: 20px;
          }
        }
      `}</style>

      <div className="hero-section">
        <div className="hero-badge">
          <span></span> AI-Powered Life & Career Acceleration
        </div>
        <h1>Build the version of yourself that <em>wins.</em></h1>
        <p>BrightPath generates a personalized multi-year roadmap, daily tasks, and adaptive life plans — powered by AI, refined by you.</p>
        <div className="button-row" style={{ justifyContent: 'center' }}>
          <Link href="/register">
            <button className="btn-primary">Get Your Roadmap →</button>
          </Link>
          <Link href="https://1drv.ms/v/c/ce2923925a6849ed/IQDNtC941fyqT4DaVQXSbqaQAaeyldsWSKHptP3r-g5xALY?e=j78vQj" target="_blank" rel="noopener noreferrer">
            <button className="btn-outline">Watch Demo</button>
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">3yr</div>
            <div className="lbl">Roadmap Depth</div>
          </div>
          <div className="hero-divider"></div>
          <div className="hero-stat">
            <div className="num">74%</div>
            <div className="lbl">Avg. Success Score</div>
          </div>
          <div className="hero-divider"></div>
          <div className="hero-stat">
            <div className="num">&lt;2s</div>
            <div className="lbl">AI Response Time</div>
          </div>
          <div className="hero-divider"></div>
          <div className="hero-stat">
            <div className="num">40%+</div>
            <div className="lbl">DAU/MAU Target</div>
          </div>
        </div>
      </div>

      <div className="grid-two">
        <div className="panel">
          <h2>Start the MVP flow</h2>
          <p>Register, capture your goals, generate the roadmap, then use the dashboard and task engine to keep momentum daily.</p>
          <div className="button-row">
            <Link href="/register">
              <button className="btn-primary">Register</button>
            </Link>
            <Link href="/login">
              <button className="btn-outline">Login</button>
            </Link>
          </div>
        </div>
        <div className="panel">
          <h2>Included in this scaffold</h2>
          <div className="stack">
            <div className="list-row">
              <strong>Backend</strong>
              <span>Controllers, services, AI router, PostgreSQL schema</span>
            </div>
            <div className="list-row">
              <strong>Frontend</strong>
              <span>Dashboard, roadmap, tasks, jobs, reviews, settings</span>
            </div>
            <div className="list-row">
              <strong>Docker alignment</strong>
              <span>Next app root, Prisma migrations, health endpoint, port 3000</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}