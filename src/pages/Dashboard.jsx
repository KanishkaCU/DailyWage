import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkers, getAttendance, deleteWorker } from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Dashboard() {
  const [workers, setWorkers] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username") || "Admin";

  const todayStr = new Date().toISOString().split("T")[0];
  const displayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const workerData = await getWorkers(userId);
      setWorkers(workerData || []);

      const attData = await getAttendance(todayStr);
      setTodayAttendance(attData || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorker = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete worker ${name}?`)) return;
    try {
      await deleteWorker(id);
      loadDashboardData();
    } catch (err) {
      alert("Failed to delete worker");
    }
  };

  // Calculations
  const totalWorkers = workers.length;
  const presentTodayCount = todayAttendance.filter((a) => a.status === "Present").length;
  const attendanceRate = totalWorkers > 0 ? Math.round((presentTodayCount / totalWorkers) * 100) : 0;

  const totalPaid = workers.reduce(
    (sum, w) => sum + (w.payments?.reduce((s, p) => s + (p.amount || 0), 0) || 0),
    0
  );

  const filteredWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.phone && w.phone.includes(searchQuery))
  );

  return (
    <div className="layout">
      <Sidebar />

      <main className="main">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <span className="topbar-eyebrow">{getGreeting().toUpperCase()}, {username.toUpperCase()} 🌿</span>
            <h1>Executive Dashboard</h1>
            <span style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>{displayDate}</span>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/add-worker")}
              style={{
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                color: "#FFF",
                border: "none",
                padding: "8px 16px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
            >
              ➕ Add Worker
            </button>

            <button
              onClick={() => navigate("/attendance")}
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10B981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "8px 16px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "0.88rem",
                cursor: "pointer",
              }}
            >
              📅 Log Attendance
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="cards">
          <div className="card card--blue" onClick={() => navigate("/add-worker")} style={{ cursor: "pointer" }}>
            <div className="card-icon card-icon--blue">👥</div>
            <div className="card-body">
              <h3>{totalWorkers}</h3>
              <p>Total Registered Workers</p>
            </div>
            <span className="card-arrow">↗</span>
          </div>

          <div className="card card--amber" onClick={() => navigate("/attendance")} style={{ cursor: "pointer" }}>
            <div className="card-icon card-icon--amber">📋</div>
            <div className="card-body">
              <h3>{presentTodayCount} <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>({attendanceRate}%)</span></h3>
              <p>Present Today</p>
            </div>
            <span className="card-arrow">↗</span>
          </div>

          <div className="card card--green" onClick={() => navigate("/reports")} style={{ cursor: "pointer" }}>
            <div className="card-icon card-icon--green">₹</div>
            <div className="card-body">
              <h3>₹{totalPaid.toLocaleString()}</h3>
              <p>Total Payments Disbursed</p>
            </div>
            <span className="card-arrow">↗</span>
          </div>

          <div className="card card--purple" onClick={() => navigate("/reports")} style={{ cursor: "pointer" }}>
            <div className="card-icon card-icon--purple">📊</div>
            <div className="card-body">
              <h3>View Reports</h3>
              <p>Date Analytics & Reports</p>
            </div>
            <span className="card-arrow">↗</span>
          </div>
        </div>

        {/* Worker Roster Table */}
        <div className="table-card" style={{ marginTop: "24px" }}>
          <div className="table-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Active Workforce Roster</h3>
              <span className="table-card-meta">{totalWorkers} REGISTERED WORKERS</span>
            </div>

            <input
              type="text"
              placeholder="Search by worker name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "rgba(0, 0, 0, 0.05)",
                border: "1px solid var(--border)",
                padding: "8px 14px",
                borderRadius: "10px",
                fontSize: "0.88rem",
                minWidth: "240px",
              }}
            />
          </div>

          {loading ? (
            <p className="table-empty">Loading roster data...</p>
          ) : filteredWorkers.length === 0 ? (
            <p className="table-empty">No workers found matching your search. Click "Add Worker" to register new staff.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Worker Name</th>
                    <th>Phone</th>
                    <th>Today Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((w, idx) => {
                    const todayRecord = todayAttendance.find((a) => a.workerId?._id === w._id || a.workerId === w._id);
                    const status = todayRecord ? todayRecord.status : "Not Marked";

                    return (
                      <tr key={w._id}>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: "0.78rem", opacity: 0.6 }}>
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
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "999px",
                              fontSize: "0.78rem",
                              fontWeight: "600",
                              background:
                                status === "Present"
                                  ? "rgba(16, 185, 129, 0.15)"
                                  : status === "Absent"
                                  ? "rgba(239, 68, 68, 0.15)"
                                  : status === "Half Day"
                                  ? "rgba(245, 158, 11, 0.15)"
                                  : "rgba(148, 163, 184, 0.15)",
                              color:
                                status === "Present"
                                  ? "#10B981"
                                  : status === "Absent"
                                  ? "#EF4444"
                                  : status === "Half Day"
                                  ? "#F59E0B"
                                  : "#64748B",
                            }}
                          >
                            {status === "Present" && "✓ "}
                            {status === "Absent" && "✕ "}
                            {status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="view-btn"
                              onClick={() => navigate(`/worker/${w._id}`)}
                            >
                              Details →
                            </button>
                            <button
                              onClick={() => handleDeleteWorker(w._id, w.name)}
                              style={{
                                background: "rgba(239, 68, 68, 0.1)",
                                color: "#EF4444",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;