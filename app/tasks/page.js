"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/page-shell";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [progress, setProgress] = useState({ score: {} });

  async function loadTasks() {
    const response = await fetch("/api/tasks/today");
    const data = await response.json();
    setTasks(data.tasks || []);
  }

  async function loadProgress() {
    try {
      const response = await fetch("/api/progress");
      const data = await response.json();
      setProgress(data);
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  }

  useEffect(() => {
    loadTasks().catch(() => {});
    loadProgress().catch(() => {});
  }, []);

  async function generateTasks() {
    await fetch("/api/tasks/generate", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({}) 
    });
    await loadTasks();
  }

  async function complete(taskId) {
    await fetch("/api/tasks/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });
    await loadTasks();
  }

  const score = progress.score || {};
  const dayStreak = score.day_streak || 11;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks by category
  const categories = ["all", "Career", "Fitness", "Communication", "Learning"];
  const filteredTasks = activeCategory === "all" 
    ? tasks 
    : tasks.filter(task => task.category === activeCategory);

  // Category counts
  const categoryCounts = {
    all: tasks.length,
    Career: tasks.filter(t => t.category === "Career").length,
    Fitness: tasks.filter(t => t.category === "Fitness").length,
    Communication: tasks.filter(t => t.category === "Communication").length,
    Learning: tasks.filter(t => t.category === "Learning").length,
  };

  // Helper to get tag class based on category
  const getTagClass = (category) => {
    switch(category) {
      case "Career": return "tag-career";
      case "Fitness": return "tag-fitness";
      case "Communication": return "tag-comm";
      case "Learning": return "tag-learning";
      default: return "";
    }
  };

  // Helper to get estimated time based on task description
  const getEstimatedTime = (taskText) => {
    if (taskText.toLowerCase().includes("run") || taskText.toLowerCase().includes("walk")) return "~25 min";
    if (taskText.toLowerCase().includes("resume")) return "~30 min";
    if (taskText.toLowerCase().includes("coursera") || taskText.toLowerCase().includes("module")) return "~45 min";
    if (taskText.toLowerCase().includes("apply") || taskText.toLowerCase().includes("linkedin")) return "~40 min";
    if (taskText.toLowerCase().includes("pitch") || taskText.toLowerCase().includes("speak")) return "~10 min";
    if (taskText.toLowerCase().includes("network") || taskText.toLowerCase().includes("message")) return "~15 min";
    return "~20 min";
  };

  // ✅ CORRECTED: Use Next.js router for navigation
  const handleViewTasks = () => {
    router.push("/tasks");
  };

  // ✅ CORRECTED: Use Next.js router for navigation
  const handleViewFullRoadmap = () => {
    router.push("/roadmap");
  };

  // ✅ CORRECTED: Use Next.js router for navigation
  const handleSeeAllTasks = () => {
    router.push("/tasks");
  };

  // ✅ CORRECTED: Additional navigation handlers
  const handleViewJobs = () => {
    router.push("/jobs");
  };

  const handleViewWeeklyReview = () => {
    router.push("/review");
  };

  const handleViewSkills = () => {
    router.push("/skills");
  };

  const handleViewFitness = () => {
    router.push("/fitness");
  };

  const handleViewCommunication = () => {
    router.push("/communication");
  };

  const handleViewAIDecisions = () => {
    router.push("/decisions");
  };

  // Helper to get description based on task
  const getTaskDescription = (task) => {
    if (task.task.toLowerCase().includes("resume")) {
      return "Add your two portfolio projects and quantify the impact. Use the STAR format for bullet points.";
    }
    if (task.task.toLowerCase().includes("run")) {
      return "Keep your Health score climbing. Any pace counts — just log it.";
    }
    if (task.task.toLowerCase().includes("coursera") || task.task.toLowerCase().includes("module")) {
      return "Unit 4: Agile Sprint Planning. Watch lectures and complete the quiz.";
    }
    if (task.task.toLowerCase().includes("apply")) {
      return 'Search "Associate Product Manager Chicago." Tailoring one cover letter counts as 2x toward your application score.';
    }
    if (task.task.toLowerCase().includes("pitch")) {
      return "Your communication score is your lowest dimension. Record yourself and listen back. Aim for clarity + confidence.";
    }
    if (task.task.toLowerCase().includes("network") || task.task.toLowerCase().includes("message")) {
      return "Connect with PM professionals. Personalize each message and mention something specific about their work.";
    }
    return task.reason || "Complete this task to improve your success score.";
  };

  return (
    <PageShell 
      eyebrow="Tasks" 
      title="Today’s checklist" 
      description="Generate, review, and complete the daily actions selected by the task engine."
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

        .tasks-container {
          display: flex;
          min-height: calc(100vh - 56px);
          background: var(--bg);
          color: var(--text);
          font-family: 'Sora', sans-serif;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 260px;
          background: var(--bg2);
          border-right: 1px solid var(--border);
          padding: 24px 16px;
          position: sticky;
          top: 56px;
          height: calc(100vh - 56px);
          overflow-y: auto;
          flex-shrink: 0;
        }

        .sidebar-avatar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg3);
          border-radius: var(--radius);
          margin-bottom: 24px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--amber-dim);
          border: 2px solid var(--amber);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: var(--amber);
          flex-shrink: 0;
        }

        .sidebar-avatar .name {
          font-size: 14px;
          font-weight: 500;
        }

        .sidebar-avatar .role {
          font-size: 11px;
          color: var(--text3);
        }

        .nav-section {
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--text3);
          margin: 20px 8px 8px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 14px;
          color: var(--text2);
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 2px;
        }

        .sidebar-link:hover {
          background: var(--bg3);
          color: var(--text);
        }

        .sidebar-link.active {
          background: var(--amber-dim);
          color: var(--amber);
        }

        .sidebar-link .icon {
          width: 20px;
          text-align: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .sidebar-link .badge {
          margin-left: auto;
          background: var(--amber);
          color: #000;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        .tasks-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .tasks-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
        }

        .tasks-header p {
          font-size: 13px;
          color: var(--text2);
          margin-top: 4px;
        }

        .streak-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--amber-dim);
          border: 1px solid rgba(232,168,48,0.3);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          color: var(--amber);
        }

        .streak-badge span {
          font-weight: 700;
          font-size: 16px;
        }

        .tasks-progress {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .tp-bar-wrap {
          flex: 1;
        }

        .tp-bar-bg {
          background: var(--bg3);
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 8px;
        }

        .tp-bar-fill {
          height: 100%;
          border-radius: 4px;
          background: var(--amber);
          transition: width 0.3s ease;
        }

        .tp-nums {
          font-size: 13px;
          color: var(--text2);
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .tp-nums strong {
          color: var(--text);
          font-weight: 600;
        }

        .progress-percent {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: var(--amber);
          padding-left: 20px;
        }

        /* Category Tabs */
        .category-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .cat-tab {
          background: none;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 7px 16px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: var(--text2);
          cursor: pointer;
          transition: all 0.2s;
        }

        .cat-tab:hover {
          border-color: var(--amber);
          color: var(--amber);
        }

        .cat-tab.active {
          background: var(--amber-dim);
          border-color: var(--amber);
          color: var(--amber);
        }

        .cat-tab .count {
          margin-left: 6px;
          font-size: 10px;
          color: var(--text3);
        }

        /* Task List */
        .task-list-full {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 20px;
        }

        .task-full-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 20px;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }

        .task-full-item:last-child {
          border-bottom: none;
        }

        .task-full-item:hover {
          background: var(--bg3);
        }

        .task-check2 {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 1.5px solid var(--border2);
          flex-shrink: 0;
          cursor: pointer;
          margin-top: 1px;
          position: relative;
          transition: all 0.2s;
        }

        .task-check2.done {
          background: var(--green);
          border-color: var(--green);
        }

        .task-check2.done::after {
          content: '✓';
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #fff;
          font-weight: 700;
        }

        .task-body {
          flex: 1;
        }

        .task-body .title {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .task-body .title.done {
          text-decoration: line-through;
          color: var(--text3);
        }

        .task-body .desc {
          font-size: 12px;
          color: var(--text3);
          line-height: 1.5;
        }

        .task-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .task-est {
          font-size: 11px;
          color: var(--text3);
        }

        .task-tag {
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .tag-career {
          background: var(--blue-dim);
          color: var(--blue);
        }

        .tag-fitness {
          background: var(--green-dim);
          color: var(--green);
        }

        .tag-comm {
          background: rgba(200,150,255,0.12);
          color: #c896ff;
        }

        .tag-learning {
          background: rgba(91,156,246,0.12);
          color: var(--blue);
        }

        /* AI Tip */
        .ai-tip {
          background: var(--amber-dim);
          border: 1px solid rgba(232,168,48,0.2);
          border-radius: var(--radius);
          padding: 14px 16px;
          font-size: 13px;
          color: var(--text2);
          display: flex;
          gap: 10px;
        }

        .ai-tip-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Generate Button */
        .generate-btn {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 20px;
        }

        .generate-btn:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        .button-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .tasks-container {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            position: relative;
            top: 0;
            height: auto;
          }
          .tasks-header {
            flex-direction: column;
            gap: 16px;
          }
          .tasks-progress {
            flex-direction: column;
            align-items: flex-start;
          }
          .progress-percent {
            padding-left: 0;
          }
        }
      `}</style>

      <div className="tasks-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-avatar">
            <div className="avatar">M</div>
            <div>
              <div className="name">Marcus Chen</div>
              <div className="role">Product Manager Track</div>
            </div>
          </div>

          <div className="nav-section">Main</div>
          <div className="sidebar-link">
            <span onClick={handleViewTasks}className="icon">⊞</span> Dashboard
          </div>
          <div className="sidebar-link active">
            <span className="icon">✓</span> Today's Tasks 
            <span className="badge">{totalTasks}</span>
          </div>
          <div className="sidebar-link">
            <span className="icon">🗺</span> Roadmap
          </div>
          <div className="sidebar-link">
            <span className="icon">💼</span> Job Tracker
          </div>

          <div className="nav-section">Growth</div>
          <div className="sidebar-link">
            <span className="icon">⚡</span> Skills Log
          </div>
          <div className="sidebar-link">
            <span className="icon">🏃</span> Fitness
          </div>
          <div className="sidebar-link">
            <span className="icon">💬</span> Communication
          </div>

          <div className="nav-section">Review</div>
          <div className="sidebar-link">
            <span className="icon">📊</span> Weekly Review
          </div>
          <div className="sidebar-link">
            <span className="icon">🧭</span> AI Decisions
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="tasks-header">
            <div>
              <h2>Today's Tasks</h2>
              <p>Monday, March 25</p>
            </div>
            <div className="streak-badge">
              🔥 <span>{dayStreak}</span> day streak
            </div>
          </div>

          <div className="tasks-progress">
            <div className="tp-bar-wrap">
              <div className="tp-nums">
                <span>Daily Progress</span>
                <strong>{completedTasks} of {totalTasks} complete</strong>
              </div>
              <div className="tp-bar-bg">
                <div className="tp-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>
            <div className="progress-percent">{completionPercentage}%</div>
          </div>

          {/* Generate Button */}
          <div className="button-row">
            <button className="generate-btn" onClick={generateTasks}>
              Generate Today's Tasks →
            </button>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "all" ? "All" : cat}
                <span className="count">({categoryCounts[cat] || 0})</span>
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="task-list-full">
            {filteredTasks.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text3)" }}>
                No tasks in this category. Generate tasks to get started!
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="task-full-item">
                  <div
                    className={`task-check2 ${task.completed ? 'done' : ''}`}
                    onClick={() => complete(task.id)}
                  />
                  <div className="task-body">
                    <div className={`title ${task.completed ? 'done' : ''}`}>
                      {task.task}
                    </div>
                    <div className="desc">
                      {getTaskDescription(task)}
                    </div>
                    <div className="task-meta">
                      <span className={`task-tag ${getTagClass(task.category)}`}>
                        {task.category || "General"}
                      </span>
                      <span className="task-est">{getEstimatedTime(task.task)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Insight */}
          {tasks.length > 0 && (
            <div className="ai-tip">
              <div className="ai-tip-icon">💡</div>
              <div style={{ fontSize: "13px", color: "var(--text2)" }}>
                <strong style={{ color: "var(--amber)" }}>AI Insight:</strong> Your communication score (42%) is significantly lagging your other dimensions. Completing today's pitch task will have a 2× multiplier on this week's score. Consider adding a networking outreach task tomorrow.
              </div>
            </div>
          )}
        </main>
      </div>
    </PageShell>
  );
}