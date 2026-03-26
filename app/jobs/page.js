// jobs/page.js
"use client";

import { useEffect, useState } from "react";
import { PageShell } from "../../components/page-shell";

export default function JobsPage() {
  const [applications, setApplications] = useState([]);
  const [remoteJobs, setRemoteJobs] = useState([]);
  const [remoteQuery, setRemoteQuery] = useState("software engineer");
  const [remoteStatus, setRemoteStatus] = useState("");
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: "", position: "", dateApplied: "", notes: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function load() {
    const response = await fetch("/api/jobs");
    const data = await response.json();
    setApplications(data.applications || []);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  useEffect(() => {
    runRemoteSearch("software engineer").catch(() => {});
  }, []);

  async function submit(event) {
    event.preventDefault();
    await fetch("/api/jobs/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ company: "", position: "", dateApplied: "", notes: "" });
    setShowForm(false);
    await load();
  }

  async function updateStatus(id, status) {
    await fetch(`/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  async function runRemoteSearch(query = remoteQuery) {
    setRemoteLoading(true);
    setRemoteStatus("Searching Remotive...");

    try {
      const response = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        setRemoteStatus(data.error || "Remote search failed");
        setRemoteJobs([]);
        return;
      }

      setRemoteJobs(data.jobs || []);
      setRemoteStatus(`Showing ${data.jobs?.length || 0} remote jobs from ${data.source}`);
    } catch {
      setRemoteStatus("Unable to search Remotive right now.");
      setRemoteJobs([]);
    } finally {
      setRemoteLoading(false);
    }
  }

  function copyRemoteJobToForm(job) {
    setForm({
      company: job.company || "",
      position: job.title || "",
      dateApplied: new Date().toISOString().split("T")[0],
      notes: `Source: Remotive\nLocation: ${job.location || "Remote"}\nURL: ${job.url}`,
    });
    setShowForm(true);
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'Applied': return 'status-applied';
      case 'Interviewing': return 'status-interview';
      case 'Offer': return 'status-offer';
      case 'Rejected': return 'status-rejected';
      default: return '';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageShell eyebrow="Applications" title="Job Tracker" description="14 applications this month · 2 interviews active">
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
          --blue: #5b9cf6;
          --blue-dim: rgba(91,156,246,0.12);
          --red: #e06060;
          --red-dim: rgba(224,96,96,0.12);
          --radius: 10px;
          --radius-lg: 16px;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
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

        .add-job-btn {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-job-btn:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        .pipeline-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }

        .pipeline-col {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 16px;
        }

        .pipe-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .pipe-header h4 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text2);
          font-weight: 600;
        }

        .pipe-count {
          background: var(--bg3);
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 12px;
          color: var(--text2);
        }

        .job-mini {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .job-mini:hover {
          border-color: var(--border2);
          transform: translateX(2px);
        }

        .job-mini .co {
          font-size: 13px;
          font-weight: 600;
        }

        .job-mini .pos {
          font-size: 12px;
          color: var(--text2);
          margin-top: 2px;
        }

        .job-mini .date {
          font-size: 11px;
          color: var(--text3);
          margin-top: 6px;
        }

        .empty-state {
          font-size: 13px;
          color: var(--text3);
          padding: 16px 0;
          text-align: center;
        }

        .jobs-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .remote-search-panel {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 28px;
        }

        .remote-search-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .remote-search-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          margin-bottom: 6px;
        }

        .remote-search-header p {
          font-size: 13px;
          color: var(--text2);
          max-width: 650px;
          line-height: 1.6;
        }

        .remote-search-form {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .remote-status {
          font-size: 12px;
          color: var(--text3);
          margin-bottom: 16px;
        }

        .remote-jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
        }

        .remote-job-card {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 18px;
          display: grid;
          gap: 10px;
        }

        .remote-job-card h4 {
          font-size: 16px;
          line-height: 1.4;
        }

        .remote-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .remote-meta span {
          font-size: 11px;
          color: var(--text2);
          background: rgba(255,255,255,0.04);
          border-radius: 999px;
          padding: 4px 8px;
        }

        .remote-job-card a {
          color: var(--amber);
          font-size: 13px;
        }

        .remote-job-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .search-input {
          background: var(--bg2);
          border: 1px solid var(--border2);
          border-radius: var(--radius);
          padding: 10px 16px;
          color: var(--text);
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          width: 240px;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: var(--amber);
        }

        .filter-btn {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 16px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: var(--text2);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: var(--amber);
          color: var(--amber);
        }

        .filter-btn.active {
          background: var(--amber-dim);
          border-color: var(--amber);
          color: var(--amber);
        }

        .jobs-table {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          align-items: center;
          font-size: 13px;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-header {
          background: var(--bg3);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text3);
          font-weight: 600;
        }

        .table-row:not(.table-header):hover {
          background: var(--bg3);
        }

        .status-pill {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .status-applied {
          background: var(--blue-dim);
          color: var(--blue);
        }

        .status-interview {
          background: var(--amber-dim);
          color: var(--amber);
        }

        .status-offer {
          background: var(--green-dim);
          color: var(--green);
        }

        .status-rejected {
          background: var(--red-dim);
          color: var(--red);
        }

        .form-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .form-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          width: 500px;
          max-width: 90%;
          box-shadow: 0 20px 35px rgba(0,0,0,0.5);
        }

        .form-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          margin-bottom: 24px;
          font-weight: 700;
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

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--amber);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn-cancel {
          background: var(--bg3);
          border: 1px solid var(--border);
          color: var(--text2);
          padding: 8px 16px;
          border-radius: var(--radius);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: var(--bg);
          border-color: var(--border2);
        }

        .btn-submit {
          background: var(--amber);
          color: #000;
          border: none;
          padding: 8px 20px;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
        }

        .btn-submit:hover {
          background: var(--amber2);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .pipeline-row {
            grid-template-columns: 1fr 1fr;
          }
          .table-row {
            grid-template-columns: 2fr 2fr 1fr;
          }
          .table-row > :nth-child(4),
          .table-row > :nth-child(5) {
            display: none;
          }
        }
      `}</style>

      <div>
        <div className="page-header">
          <div>
            <h1>Job Tracker</h1>
            <p>14 applications this month · 2 interviews active</p>
          </div>
          <button className="add-job-btn" onClick={() => setShowForm(true)}>+ Log Application</button>
        </div>

        <section className="remote-search-panel">
          <div className="remote-search-header">
            <div>
              <h3>Search Remote Jobs</h3>
              <p>
                This search uses Remotive&apos;s public remote-jobs feed. Use it to discover roles, then save promising ones into your manual tracker.
              </p>
            </div>
          </div>

          <form
            className="remote-search-form"
            onSubmit={(event) => {
              event.preventDefault();
              runRemoteSearch();
            }}
          >
            <input
              className="search-input"
              type="text"
              value={remoteQuery}
              onChange={(event) => setRemoteQuery(event.target.value)}
              placeholder="Search remote roles like product manager or devops engineer"
            />
            <button type="submit" className="add-job-btn" disabled={remoteLoading}>
              {remoteLoading ? "Searching..." : "Search Remotive"}
            </button>
          </form>

          <div className="remote-status">{remoteStatus || "Search live remote roles and copy any result into your application tracker."}</div>

          <div className="remote-jobs-grid">
            {remoteJobs.map((job) => (
              <article key={job.id} className="remote-job-card">
                <h4>{job.title}</h4>
                <div style={{ color: 'var(--text2)', fontSize: '14px' }}>{job.company}</div>
                <div className="remote-meta">
                  {job.location ? <span>{job.location}</span> : null}
                  {job.category ? <span>{job.category}</span> : null}
                  {job.jobType ? <span>{job.jobType}</span> : null}
                </div>
                {job.salary ? <div style={{ color: 'var(--amber)', fontSize: '13px' }}>{job.salary}</div> : null}
                <div className="remote-job-actions">
                  <button type="button" className="filter-btn" onClick={() => copyRemoteJobToForm(job)}>
                    Save to Tracker
                  </button>
                  <a href={job.url} target="_blank" rel="noreferrer">
                    View job →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pipeline Kanban */}
        <div className="pipeline-row">
          <div className="pipeline-col">
            <div className="pipe-header">
              <h4>Applied</h4>
              <span className="pipe-count">{applications.filter(a => a.status === 'Applied').length}</span>
            </div>
            {applications.filter(a => a.status === 'Applied').slice(0, 3).map(app => (
              <div key={app.id} className="job-mini">
                <div className="co">{app.company}</div>
                <div className="pos">{app.position}</div>
                <div className="date">{app.dateApplied}</div>
              </div>
            ))}
            {applications.filter(a => a.status === 'Applied').length === 0 && (
              <div className="empty-state">No applications</div>
            )}
          </div>

          <div className="pipeline-col">
            <div className="pipe-header">
              <h4>Interview</h4>
              <span className="pipe-count">{applications.filter(a => a.status === 'Interviewing').length}</span>
            </div>
            {applications.filter(a => a.status === 'Interviewing').slice(0, 3).map(app => (
              <div key={app.id} className="job-mini" style={{ borderColor: 'rgba(232,168,48,0.3)' }}>
                <div className="co">{app.company}</div>
                <div className="pos">{app.position}</div>
                <div className="date" style={{ color: 'var(--amber)' }}>📅 {app.interviewDate || 'Scheduled'}</div>
              </div>
            ))}
            {applications.filter(a => a.status === 'Interviewing').length === 0 && (
              <div className="empty-state">No interviews scheduled</div>
            )}
          </div>

          <div className="pipeline-col">
            <div className="pipe-header">
              <h4>Offer</h4>
              <span className="pipe-count">{applications.filter(a => a.status === 'Offer').length}</span>
            </div>
            {applications.filter(a => a.status === 'Offer').map(app => (
              <div key={app.id} className="job-mini" style={{ borderColor: 'rgba(77,187,138,0.3)' }}>
                <div className="co">{app.company}</div>
                <div className="pos">{app.position}</div>
                <div className="date" style={{ color: 'var(--green)' }}>🎉 Offer received</div>
              </div>
            ))}
            {applications.filter(a => a.status === 'Offer').length === 0 && (
              <div className="empty-state">No offers yet</div>
            )}
          </div>

          <div className="pipeline-col">
            <div className="pipe-header">
              <h4>Closed</h4>
              <span className="pipe-count">{applications.filter(a => a.status === 'Rejected').length}</span>
            </div>
            {applications.filter(a => a.status === 'Rejected').slice(0, 2).map(app => (
              <div key={app.id} className="job-mini">
                <div className="co">{app.company}</div>
                <div className="pos">{app.position}</div>
                <div className="date" style={{ color: 'var(--red)' }}>Rejected</div>
              </div>
            ))}
            {applications.filter(a => a.status === 'Rejected').length === 0 && (
              <div className="empty-state">No closed applications</div>
            )}
          </div>
        </div>

        {/* Search and Table */}
        <div className="jobs-toolbar">
          <input 
            className="search-input" 
            type="text" 
            placeholder="Search companies or roles…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className={`filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'Applied' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Applied')}
          >
            Applied
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'Interviewing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Interviewing')}
          >
            Interviewing
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'Offer' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Offer')}
          >
            Offer
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'Rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Rejected')}
          >
            Rejected
          </button>
        </div>

        <div className="jobs-table">
          <div className="table-row table-header">
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span>Applied</span>
            <span>Follow-up</span>
          </div>
          {filteredApplications.map((app) => (
            <div key={app.id} className="table-row">
              <span style={{ fontWeight: 500 }}>{app.company}</span>
              <span style={{ color: 'var(--text2)' }}>{app.position}</span>
              <span>
                <span className={`status-pill ${getStatusClass(app.status)}`}>
                  {app.status}
                </span>
              </span>
              <span style={{ color: 'var(--text2)' }}>{app.dateApplied}</span>
              <span style={{ color: 'var(--amber)' }}>{app.followUpDate || '—'}</span>
            </div>
          ))}
          {filteredApplications.length === 0 && (
            <div className="table-row">
              <span colSpan="5" style={{ textAlign: 'center', color: 'var(--text3)', padding: '40px' }}>
                No applications found
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="form-modal" onClick={() => setShowForm(false)}>
          <div className="form-card" onClick={(e) => e.stopPropagation()}>
            <h2>Log Application</h2>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Company</label>
                <input 
                  value={form.company} 
                  onChange={(e) => setForm({ ...form, company: e.target.value })} 
                  placeholder="e.g., Stripe, Notion, Figma"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input 
                  value={form.position} 
                  onChange={(e) => setForm({ ...form, position: e.target.value })} 
                  placeholder="e.g., Product Manager, Software Engineer"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Date Applied</label>
                <input 
                  type="date" 
                  value={form.dateApplied} 
                  onChange={(e) => setForm({ ...form, dateApplied: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  value={form.notes} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                  placeholder="Add any relevant notes about the application, job description highlights, or referral info..."
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageShell>
  );
}
