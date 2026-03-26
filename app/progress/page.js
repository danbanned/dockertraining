"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/page-shell";

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetch("/api/progress")
      .then((response) => response.json())
      .then(setProgress)
      .catch(() => {});
  }, []);

  return (
    <PageShell eyebrow="Progress" title="Progress dashboard" description="Visualize the weighted score inputs and identify which category needs intervention next.">
      <div className="panel">
        <div className="stack">
          <div className="list-row"><strong>Total score</strong><span>{progress?.score?.totalScore ?? 0}</span></div>
          <div className="list-row"><strong>Skills</strong><span>{progress?.score?.skills ?? 0}</span></div>
          <div className="list-row"><strong>Applications</strong><span>{progress?.score?.applications ?? 0}</span></div>
          <div className="list-row"><strong>Communication</strong><span>{progress?.score?.communication ?? 0}</span></div>
          <div className="list-row"><strong>Health</strong><span>{progress?.score?.health ?? 0}</span></div>
          <div className="list-row"><strong>Environment</strong><span>{progress?.score?.environment ?? 0}</span></div>
          <div className="list-row"><strong>Consistency</strong><span>{progress?.score?.consistency ?? 0}</span></div>
          <div className="list-row"><strong>Lowest category</strong><span>{progress?.score?.lowestCategory ?? "n/a"}</span></div>
        </div>
      </div>
    </PageShell>
  );
}
