import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkers } from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Dashboard() {
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getWorkers(userId).then(setWorkers).catch(console.error);
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalPaid = workers.reduce(
    (sum, w) => sum + (w.payments?.reduce((s, p) => s + (p.amount || 0), 0) || 0),
    0
  );

  return (
    <div className="layout">
      <Sidebar />

      <main className="main">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-eyebrow">WORKFORCE MANAGEMENT</span>
            <h1>Dashboard</h1>
            <span>{today}</span>
          </div>
          <div className="topbar-badge">
            <span className="topbar-badge-dot" />
            System Online
          </div>
        </div>

        {/* Summary Cards */}
        <div className="cards">
          <div className="card card--blue">
            <div className="card-icon card-icon--blue">👥</div>
            <div className="card-body">
              <h3>{workers.length}</h3>
              <p>Total Workers</p>
            </div>
            <span className="card-arrow">↗</span>
          </div>

          <div className="card card--amber" onClick={() => navigate("/attendance")}>
            <div className="card-icon card-icon--amber">📋</div>
            <div className="card-body">
              <h3>Log</h3>
              <p>Attendance</p>
            </div>
            <span className="card-arrow">↗</span>
          </div>

          <div className="card card--green" onClick={() => navigate("/reports")}>
            <div className="card-icon card-icon--green">₹</div>
            <div className="card-body">
              <h3>₹{(totalPaid / 1000).toFixed(1)}k</h3>
              <p>Total Payments</p>
            </div>
            <span className="card-arrow">↗</span>
          </div>

          <div className="card card--purple" onClick={() => navigate("/reports")}>
            <div className="card-icon card-icon--purple">📊</div>
            <div className="card-body">
              <h3>View</h3>
              <p>Reports</p>
            </div>
            <span className="card-arrow">↗</span>
          </div>
        </div>

        {/* Worker Table */}
        <div className="table-card">
          <div className="table-card-header">
            <h3>Workers Roster</h3>
            <span className="table-card-meta">{workers.length} TOTAL</span>
          </div>

          {workers.length === 0 ? (
            <p className="table-empty">No workers found. Add workers to get started.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w, idx) => (
                  <tr key={w._id}>
                    <td>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-dim)" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td>
                      <div className="worker-cell">
                        <div className="worker-cell-avatar">
                          {w.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="worker-cell-name">{w.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="phone-cell">{w.phone || "—"}</span>
                    </td>
                    <td>
                      <span className="status-pill">
                        <span className="status-dot" />
                        Active
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/worker/${w._id}`)}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;