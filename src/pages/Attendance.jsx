import { useEffect, useState } from "react";
import { getWorkers, markAttendance } from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/attendance.css";

function Attendance() {
  const [workers, setWorkers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});

  const userId = localStorage.getItem("userId");
  const today = new Date().toISOString().split("T")[0];
  const displayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  useEffect(() => {
    getWorkers(userId).then(setWorkers).catch(console.error);
  }, []);

  const handleStatusChange = (workerId, status) => {
    setSaved((p) => ({ ...p, [workerId]: false }));
    setAttendanceData((p) => ({
      ...p,
      [workerId]: { status, wage: p[workerId]?.wage || "" },
    }));
  };

  const handleWageChange = (workerId, wage) => {
    setAttendanceData((p) => ({
      ...p,
      [workerId]: { ...p[workerId], wage },
    }));
  };

  const saveAttendance = async (workerId) => {
    const data = attendanceData[workerId];
    if (!data) return;

    if (data.status === "Present" && !data.wage) {
      setMessage({ text: "Please enter wage before saving", type: "warn" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return;
    }

    setSaving((p) => ({ ...p, [workerId]: true }));

    try {
      await markAttendance({
        workerId,
        date: today,
        status: data.status,
        wage: data.status === "Present" ? Number(data.wage) : 0,
      });
      setSaved((p) => ({ ...p, [workerId]: true }));
      setMessage({ text: "Attendance saved successfully", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch {
      setMessage({ text: "Failed to save attendance", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } finally {
      setSaving((p) => ({ ...p, [workerId]: false }));
    }
  };

  const presentCount = Object.values(attendanceData).filter((d) => d.status === "Present").length;
  const absentCount = Object.values(attendanceData).filter((d) => d.status === "Absent").length;
  const markedCount = Object.keys(attendanceData).length;

  return (
    <div className="att-layout">
      <Sidebar />

      <main className="att-main">
        {/* Top Bar */}
        <div className="att-topbar">
          <div className="att-topbar-left">
            <span className="att-eyebrow">WORKFORCE MANAGEMENT</span>
            <h1 className="att-title">Attendance <span className="att-title-accent">Log</span></h1>
            <span className="att-date">{displayDate}</span>
          </div>
          <div className="att-topbar-right">
            <div className="att-stat-pill att-stat-pill--green">
              <span className="att-stat-dot" />
              {presentCount} Present
            </div>
            <div className="att-stat-pill att-stat-pill--red">
              <span className="att-stat-dot att-stat-dot--red" />
              {absentCount} Absent
            </div>
            <div className="att-stat-pill">
              {markedCount}/{workers.length} Marked
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {workers.length > 0 && (
          <div className="att-progress-wrap">
            <div className="att-progress-track">
              <div
                className="att-progress-fill"
                style={{ width: `${(markedCount / workers.length) * 100}%` }}
              />
            </div>
            <span className="att-progress-label">
              {Math.round((markedCount / workers.length) * 100)}% logged
            </span>
          </div>
        )}

        {/* Global Message */}
        {message.text && (
          <div className={`att-message att-message--${message.type}`}>
            {message.type === "success" && "✓ "}
            {message.type === "warn" && "⚠ "}
            {message.type === "error" && "✕ "}
            {message.text}
          </div>
        )}

        {/* Worker Cards */}
        {workers.length === 0 ? (
          <div className="att-empty">
            <div className="att-empty-icon">👷</div>
            <p>No workers found. Add workers first.</p>
          </div>
        ) : (
          <div className="att-grid">
            {workers.map((worker, idx) => {
              const entry = attendanceData[worker._id];
              const status = entry?.status;
              const isSaved = saved[worker._id];
              const isSaving = saving[worker._id];

              return (
                <div
                  key={worker._id}
                  className={`att-card ${status === "Present" ? "att-card--present" : ""} ${status === "Absent" ? "att-card--absent" : ""} ${isSaved ? "att-card--saved" : ""}`}
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  {/* Card Header */}
                  <div className="att-card-header">
                    <div className="att-avatar">
                      {worker.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="att-worker-info">
                      <span className="att-worker-name">{worker.name}</span>
                      <span className="att-worker-phone">{worker.phone || "—"}</span>
                    </div>
                    {isSaved && (
                      <div className="att-saved-badge">✓ Saved</div>
                    )}
                    {!status && (
                      <div className="att-pending-badge">Pending</div>
                    )}
                  </div>

                  {/* Status Toggle */}
                  <div className="att-toggle-group">
                    <button
                      className={`att-toggle att-toggle--present ${status === "Present" ? "active" : ""}`}
                      onClick={() => handleStatusChange(worker._id, "Present")}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Present
                    </button>
                    <button
                      className={`att-toggle att-toggle--absent ${status === "Absent" ? "active" : ""}`}
                      onClick={() => handleStatusChange(worker._id, "Absent")}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Absent
                    </button>
                  </div>

                  {/* Wage Input */}
                  {status === "Present" && (
                    <div className="att-wage-row">
                      <div className="att-wage-input-wrap">
                        <span className="att-wage-prefix">₹</span>
                        <input
                          className="att-wage-input"
                          type="number"
                          placeholder="Daily wage"
                          value={entry?.wage || ""}
                          onChange={(e) => handleWageChange(worker._id, e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  {status && (
                    <button
                      className={`att-save-btn ${isSaved ? "att-save-btn--done" : ""}`}
                      onClick={() => saveAttendance(worker._id)}
                      disabled={isSaving || isSaved}
                    >
                      {isSaving ? (
                        <span className="att-spinner" />
                      ) : isSaved ? (
                        "✓ Saved"
                      ) : (
                        "Save Attendance"
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button className="att-back-btn" onClick={() => window.history.back()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Done
        </button>
      </main>
    </div>
  );
}

export default Attendance;