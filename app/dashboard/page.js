"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "../../components/page-shell";
import { MetricCard } from "../../components/metric-card";
import { TaskList } from "../../components/task-list";



export default function DashboardPage() {
  const router = useRouter();
  const [progress, setProgress] = useState({ score: {} });
  const [tasks, setTasks] = useState([]);


//Slogan - Dont choose the wrong path choose bright path

  useEffect(() => {
    fetch("/api/progress")
      .then((response) => response.json())
      .then(setProgress)
      .catch(() => {});

    fetch("/api/tasks/today")
      .then((response) => response.json())
      .then((data) => setTasks(data.tasks || []))
      .catch(() => {});
  }, []);

  const score = progress.score || {};
  const totalScore = Math.round(score.totalScore || 72);
  const lowestCategory = score.lowestCategory || "Communication";
  
  // Extract dimension scores from progress data or use defaults
  const dimensions = {
    Skills: score.skills_score || 78,
    Applications: score.applications_score || 65,
    Communication: score.communication_score || 42,
    Health: score.health_score || 80,
    Consistency: score.consistency_score || 70,
  };
  
  const applicationsThisMonth = score.applications_this_month || 14;
  const tasksDoneToday = score.tasks_done_today || 3;
  const totalTasksToday = score.total_tasks_today || 5;
  const dayStreak = score.day_streak || 11;
  const skillsLoggedThisWeek = score.skills_logged_this_week || 6;
  const userName = progress.user_name || "Marcus Chen";
  const userRole = progress.user_role || "Product Manager Track";

  // Calculate circle progress for success score
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = totalScore / 100;
  const dashOffset = circumference * (1 - scorePercent);

  const roadmapItems = [
    {
      title: "Build PM Portfolio",
      period: "Jan–Feb",
      status: "done",
      badge: "Completed",
    },
    {
      title: "Active Job Applications",
      period: "Mar–Apr · In Progress",
      status: "active",
      badge: "Current",
    },
    {
      title: "Interview Prep Intensive",
      period: "May",
      status: "future",
      badge: "Upcoming",
    },
  ];

  const todayTasks = tasks.length > 0 ? tasks : [
    {
      id: 1,
      text: "Update resume with PM projects",
      done: false,
      tag: "Career",
      tagClass: "tag-career",
    },
    {
      id: 2,
      text: "Morning run — 3km",
      done: false,
      tag: "Fitness",
      tagClass: "tag-fitness",
    },
    {
      id: 3,
      text: "Apply to 2 PM roles on LinkedIn",
      done: false,
      tag: "Career",
      tagClass: "tag-career",
    },
    {
      id: 4,
      text: "Practice elevator pitch (5 min)",
      done: false,
      tag: "Comm",
      tagClass: "tag-comm",
    },
    {
      id: 5,
      text: "Complete Coursera PM module",
      done: false,
      tag: "Career",
      tagClass: "tag-career",
    },
  ];

const handleTaskToggle = (taskId) => {
    // Toggle task completion - this would sync with API in production
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
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
    router.push("/weekly-review");
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

  return (
    <PageShell 
      eyebrow="Dashboard" 
      title="Daily control room for your acceleration plan" 
      description="Watch the weighted success score, the weakest category, and the tasks that matter most today."
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

        .dashboard-container {
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

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .page-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
        }

        .page-header p {
          font-size: 14px;
          color: var(--text2);
          margin-top: 4px;
        }

        .view-tasks-btn {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-tasks-btn:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        /* Score Hero Section */
        .score-hero {
          background: linear-gradient(135deg, rgba(232,168,48,0.1) 0%, rgba(232,168,48,0.03) 100%);
          border: 1px solid rgba(232,168,48,0.2);
          border-radius: var(--radius-lg);
          padding: 28px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .score-ring {
          position: relative;
          width: 90px;
          height: 90px;
          flex-shrink: 0;
        }

        .score-ring svg {
          transform: rotate(-90deg);
        }

        .score-ring .score-num {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--amber);
        }

        .score-details h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .score-details p {
          font-size: 13px;
          color: var(--text2);
        }

        .score-dims {
          display: flex;
          gap: 12px;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .dim-pill {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid var(--border2);
          color: var(--text2);
        }

        .dim-pill.low {
          border-color: rgba(224,96,96,0.4);
          color: var(--red);
          background: var(--red-dim);
        }

        /* Cards Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .metric-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px;
        }

        .metric-card .m-label {
          font-size: 11px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .metric-card .m-val {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--text);
        }

        .metric-card .m-sub {
          font-size: 12px;
          color: var(--text3);
          margin-top: 4px;
        }

        .metric-card .m-val.up {
          color: var(--green);
        }

        .metric-card .m-val.warn {
          color: var(--amber);
        }

        /* Two Column Layout */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .widget {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
        }

        .widget-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .widget-header h3 {
          font-size: 15px;
          font-weight: 600;
        }

        .widget-header a {
          font-size: 12px;
          color: var(--amber);
          cursor: pointer;
          text-decoration: none;
        }

        .widget-header a:hover {
          text-decoration: underline;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--border);
        }

        .task-item:last-child {
          border-bottom: none;
        }

        .task-check {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid var(--border2);
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .task-check.done {
          background: var(--green);
          border-color: var(--green);
        }

        .task-check.done::after {
          content: '✓';
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #fff;
          font-weight: 700;
        }

        .task-text {
          font-size: 13px;
          flex: 1;
        }

        .task-text.done {
          text-decoration: line-through;
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

        .roadmap-item {
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          gap: 14px;
        }

        .roadmap-item:last-child {
          border-bottom: none;
        }

        .rm-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .rm-dot.done {
          background: var(--green);
        }

        .rm-dot.active {
          background: var(--amber);
        }

        .rm-dot.future {
          background: var(--border2);
        }

        .rm-title {
          font-size: 13px;
          font-weight: 500;
        }

        .rm-sub {
          font-size: 12px;
          color: var(--text3);
          margin-top: 2px;
        }

        .rm-badge {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 10px;
          background: var(--green-dim);
          color: var(--green);
          margin-top: 4px;
          display: inline-block;
        }

        .rm-badge.active {
          background: var(--amber-dim);
          color: var(--amber);
        }

        .rm-badge.future {
          background: var(--bg3);
          color: var(--text3);
        }

        /* Existing metrics grid styles from original */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          text-align: center;
        }

        .stat-label {
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text3);
          margin-bottom: 8px;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--amber);
        }

        .grid.metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .grid.two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .panel {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .panel h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          margin-bottom: 12px;
        }

        .panel p {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.6;
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
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }

        .list-row strong {
          color: var(--text);
        }

        .list-row span {
          color: var(--text2);
        }

        .hero {
          margin-bottom: 48px;
          text-align: center;
        }

        .hero .eyebrow {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 16px;
        }

        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          max-width: 800px;
          margin: 0 auto 16px;
        }

        .hero p {
          font-size: 18px;
          color: var(--text2);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            position: relative;
            top: 0;
            height: auto;
          }
          .two-col,
          .grid.two {
            grid-template-columns: 1fr;
          }
          .hero h1 {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-avatar">
            <div className="avatar">{userName.charAt(0)}</div>
            <div>
              <div className="name">{userName}</div>
              <div className="role">{userRole}</div>
            </div>
          </div>

          <div className="nav-section">Main</div>
          <div className="sidebar-link active">
            <span className="icon">⊞</span> Dashboard
          </div>
          <div className="sidebar-link" onClick={handleViewTasks}>
            <span className="icon">✓</span> Today Tasks
            <span className="badge">{totalTasksToday}</span>
          </div>
          <div className="sidebar-link" onClick={handleViewFullRoadmap}>
            <span className="icon">🗺</span> Roadmap
          </div>
          <div className="sidebar-link" onClick={handleViewJobs}>
            <span className="icon">💼</span> Job Tracker
          </div>

          <div className="nav-section">Growth</div>
          <div className="sidebar-link" onClick={handleViewSkills}>
            <span className="icon">⚡</span> Skills Log
          </div>
          <div className="sidebar-link" onClick={handleViewFitness}>
            <span className="icon">🏃</span> Fitness
          </div>
          <div className="sidebar-link" onClick={handleViewCommunication}>
            <span className="icon">💬</span> Communication
          </div>

          <div className="nav-section">Review</div>
          <div className="sidebar-link" onClick={handleViewWeeklyReview}>
            <span className="icon">📊</span> Weekly Review
          </div>
          <div className="sidebar-link" onClick={handleViewAIDecisions}>
            <span className="icon">🧭</span> AI Decisions
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>Good morning, {userName.split(' ')[0]}.</h1>
              <p>Monday, March 25 · Week 11 of your roadmap</p>
            </div>
            <button className="view-tasks-btn" onClick={handleViewTasks}>
              View Today Tasks →
            </button>
          </div>

          {/* Success Score Section */}
          <div className="score-hero">
            <div className="score-ring">
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="7"
                />
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  fill="none"
                  stroke="#e8a830"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="score-num">{totalScore}</div>
            </div>
            <div className="score-details">
              <h3>Your Success Score: {totalScore} / 100</h3>
              <p>Up 4 points from last week · Keep going!</p>
              <div className="score-dims">
                {Object.entries(dimensions).map(([key, value]) => (
                  <div
                    key={key}
                    className={`dim-pill ${key === lowestCategory ? 'low' : ''}`}
                  >
                    {key} {value}%
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="cards-grid">
            <div className="metric-card">
              <div className="m-label">Applications</div>
              <div className="m-val warn">{applicationsThisMonth}</div>
              <div className="m-sub">this month</div>
            </div>
            <div className="metric-card">
              <div className="m-label">Tasks Done Today</div>
              <div className="m-val up">{tasksDoneToday} / {totalTasksToday}</div>
              <div className="m-sub">{Math.round((tasksDoneToday / totalTasksToday) * 100)}% complete</div>
            </div>
            <div className="metric-card">
              <div className="m-label">Day Streak</div>
              <div className="m-val up">🔥 {dayStreak}</div>
              <div className="m-sub">personal best!</div>
            </div>
            <div className="metric-card">
              <div className="m-label">Skills Logged</div>
              <div className="m-val">{skillsLoggedThisWeek}</div>
              <div className="m-sub">this week</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="two-col">
            <div className="widget">
              <div className="widget-header">
                <h3>Today Tasks</h3>
                <a onClick={handleSeeAllTasks}>See all →</a>
              </div>
              {todayTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div
                    className={`task-check ${task.done ? 'done' : ''}`}
                    onClick={() => handleTaskToggle(task.id)}
                  />
                  <span className={`task-text ${task.done ? 'done' : ''}`}>
                    {task.text}
                  </span>
                  <span className={`task-tag ${task.tagClass}`}>{task.tag}</span>
                </div>
              ))}
            </div>

            <div className="widget">
              <div className="widget-header">
                <h3>Roadmap — Month 3</h3>
                <a onClick={handleViewFullRoadmap}>View full →</a>
              </div>
              {roadmapItems.map((item, idx) => (
                <div key={idx} className="roadmap-item">
                  <div className={`rm-dot ${item.status}`} />
                  <div>
                    <div className="rm-title">{item.title}</div>
                    <div className="rm-sub">{item.period}</div>
                    <span className={`rm-badge ${item.status}`}>{item.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Original Stats Grid and Metrics Grid from original code - preserved */}
          <div className="hero" style={{ marginTop: "48px" }}>
            <span className="eyebrow">Your Journey</span>
            <h1>Build the version of yourself that wins.</h1>
            <p>BrightPath generates a personalized multi-year roadmap, daily tasks, and adaptive life plans — powered by AI, refined by you.</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">ROADMAP DEPTH</div>
              <div className="stat-number">3Yr</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">AVG. SUCCESS SCORE</div>
              <div className="stat-number">{Math.round(score.totalScore || 0)}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">AI RESPONSE TIME</div>
              <div className="stat-number">&lt;2S</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">DAU/MAU TARGET</div>
              <div className="stat-number">40%+</div>
            </div>
          </div>

          <div className="grid metrics">
            <MetricCard 
              label="Career Progress %" 
              value={`${Math.round(score.totalScore || 0)}%`} 
              detail="Weighted BrightPath score" 
            />
            <MetricCard 
              label="Applications Sent" 
              value={progress.latest?.applications_score || 0} 
              detail="Latest tracked applications score" 
            />
            <MetricCard 
              label="Skills Progress" 
              value={progress.latest?.skills_score || 0} 
              detail="Current skill development score" 
            />
            <MetricCard 
              label="Consistency Streak" 
              value={progress.latest?.consistency_score || 0} 
              detail="Execution consistency signal" 
            />
            <MetricCard 
              label="Weekly Score" 
              value={score.totalScore || 0} 
              detail={`Lowest category: ${score.lowestCategory || "n/a"}`} 
            />
          </div>

          <div className="grid two">
            <TaskList tasks={tasks} />
            <div className="panel">
              <h2>Execution Rule</h2>
              <p>BrightPath does not spread effort evenly. It pushes attention toward the lowest-scoring category until the whole system becomes more balanced.</p>
              <div className="stack" style={{ marginTop: "24px" }}>
                <div className="list-row">
                  <strong>Top focus</strong>
                  <span>{score.lowestCategory || "Generate progress data to unlock prioritization"}</span>
                </div>
                <div className="list-row">
                  <strong>Planner</strong>
                  <span>Groq primary, Gemini backup, Ollama offline fallback</span>
                </div>
                <div className="list-row">
                  <strong>Roadmap horizon</strong>
                  <span>36-month compounding plan</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageShell>
  );
}