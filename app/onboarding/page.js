// onboarding/page.js
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "../../components/page-shell";

const steps = [
  ["career", "Career Vision", "What role or direction are you building toward?"],
  ["incomeGoal", "Income Target", "What income level are you working toward?"],
  ["cityGoal", "City and Environment", "Where do you want to live and work?"],
  ["fitnessGoal", "Fitness", "What health standard do you want to maintain?"],
  ["communicationGoal", "Communication", "How do you want to improve communication and presence?"],
];

export default function OnboardingPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("");
  const current = useMemo(() => steps[index], [index]);

  async function submit() {
    setStatus("Saving goals...");
    const response = await fetch("/api/user/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        goalMap: {
          career: values.career,
          income: values.incomeGoal,
          city: values.cityGoal,
          fitness: values.fitnessGoal,
          communication: values.communicationGoal,
        },
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "Failed to save goals");
      return;
    }
    await fetch("/api/roadmap/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    router.push("/dashboard");
  }

  return (
    <PageShell eyebrow="Onboarding" title="Capture the inputs that drive BrightPath" description="This multi-step form sets the non-AI logic that the roadmap and task engines will use.">
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

        .onboarding-container {
          max-width: 680px;
          margin: 0 auto;
        }

        .progress-bar-wrap {
          margin-bottom: 48px;
        }

        .progress-steps {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .prog-step {
          height: 3px;
          flex: 1;
          border-radius: 2px;
          background: var(--border2);
          transition: background 0.3s;
        }

        .prog-step.done {
          background: var(--amber);
        }

        .prog-step.active {
          background: var(--amber);
          opacity: 0.5;
        }

        .prog-label {
          font-size: 12px;
          color: var(--text3);
        }

        .onboard-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 40px;
        }

        .onboard-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .onboard-card .sub {
          font-size: 14px;
          color: var(--text2);
          margin-bottom: 32px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text3);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group textarea {
          width: 100%;
          background: var(--bg3);
          border: 1px solid var(--border2);
          border-radius: var(--radius);
          padding: 12px 16px;
          color: var(--text);
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.2s;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: var(--amber);
        }

        .button-row {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }

        .btn-back {
          background: none;
          border: 1px solid var(--border2);
          color: var(--text2);
          padding: 10px 20px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          border-color: var(--amber);
          color: var(--amber);
        }

        .btn-next {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-next:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        .status-message {
          margin-top: 16px;
          font-size: 13px;
          color: var(--amber);
          text-align: center;
        }
      `}</style>

      <div className="onboarding-container">
        <div className="progress-bar-wrap">
          <div className="progress-steps">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`prog-step ${idx < index ? 'done' : ''} ${idx === index ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="prog-label">Step {index + 1} of {steps.length} — {current[1]}</div>
        </div>

        <div className="onboard-card">
          <h2>{current[1]}</h2>
          <p className="sub">{current[2]}</p>

          <div className="form-group">
            <label>Your answer</label>
            <textarea
              value={values[current[0]] || ""}
              onChange={(event) => setValues({ ...values, [current[0]]: event.target.value })}
              placeholder="Be specific. The more detail you provide, the better BrightPath can tailor your roadmap..."
            />
          </div>

          <div className="button-row">
            {index > 0 && (
              <button className="btn-back" onClick={() => setIndex(index - 1)}>
                ← Back
              </button>
            )}
            {index < steps.length - 1 ? (
              <button className="btn-next" onClick={() => setIndex(index + 1)}>
                Continue →
              </button>
            ) : (
              <button className="btn-next" onClick={submit}>
                Finish Onboarding →
              </button>
            )}
          </div>
          {status && <div className="status-message">{status}</div>}
        </div>
      </div>
    </PageShell>
  );
}