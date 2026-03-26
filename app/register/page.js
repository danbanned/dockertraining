// register/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "../../components/page-shell";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    career: "",
    incomeGoal: "",
    cityGoal: "",
    fitnessGoal: "",
    communicationGoal: "",
  });
  const [status, setStatus] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("Creating account...");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "Registration failed");
      return;
    }
    setStatus("Account created! Redirecting...");
    setTimeout(() => router.push("/onboarding"), 1500);
  }

  return (
    <PageShell eyebrow="Auth" title="Create your BrightPath account" description="Capture the goals that will drive the roadmap and daily task engine.">
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

        .register-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 40px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text3);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: var(--radius);
          padding: 10px 12px;
          color: var(--text);
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--amber);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .register-btn {
          width: 100%;
          background: var(--amber);
          color: #000;
          border: none;
          padding: 12px;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          transition: all 0.2s;
          margin-top: 20px;
        }

        .register-btn:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        .status-message {
          margin-top: 16px;
          text-align: center;
          font-size: 13px;
          color: var(--amber);
        }

        .login-link {
          text-align: center;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .login-link a {
          color: var(--amber);
          text-decoration: none;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-card {
            padding: 24px;
          }
        }
      `}</style>

      <div className="register-container">
        <div className="form-card">
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={form.password} 
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Create a strong password"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Career Goal</label>
                <input 
                  value={form.career} 
                  onChange={(event) => setForm({ ...form, career: event.target.value })}
                  placeholder="e.g., Product Manager at a tech company"
                />
              </div>
              <div className="form-group">
                <label>Income Goal</label>
                <input 
                  value={form.incomeGoal} 
                  onChange={(event) => setForm({ ...form, incomeGoal: event.target.value })}
                  placeholder="e.g., $120,000"
                />
              </div>
              <div className="form-group">
                <label>City Goal</label>
                <input 
                  value={form.cityGoal} 
                  onChange={(event) => setForm({ ...form, cityGoal: event.target.value })}
                  placeholder="e.g., Chicago, IL"
                />
              </div>
              <div className="form-group">
                <label>Fitness Goal</label>
                <input 
                  value={form.fitnessGoal} 
                  onChange={(event) => setForm({ ...form, fitnessGoal: event.target.value })}
                  placeholder="e.g., Run a half marathon"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Communication Goal</label>
              <textarea 
                value={form.communicationGoal} 
                onChange={(event) => setForm({ ...form, communicationGoal: event.target.value })}
                placeholder="e.g., Improve public speaking and networking skills"
              />
            </div>
            <button type="submit" className="register-btn">Create Account →</button>
            {status && <div className="status-message">{status}</div>}
          </form>
          <div className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}