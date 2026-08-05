import { useEffect, useState } from "react";
import { getWorkers, markAttendance, getAttendance } from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/attendance.css";

function Attendance() {
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [workers, setWorkers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [loading, setLoading] = useState(true);

  // Load workers & saved attendance whenever selectedDate changes
  useEffect(() => {
    fetchWorkersAndAttendance();
  }, [selectedDate]);

  const fetchWorkersAndAttendance = async () => {
    try {
      setLoading(true);
      const workerList = await getWorkers();
      setWorkers(workerList || []);

      const attList = await getAttendance(selectedDate);

      // Map fetched attendance to attendanceData state
      const initialMap = {};
      const savedMap = {};

      (attList || []).forEach((record) => {
        const wId = record.workerId?._id || record.workerId;
        if (wId) {
          initialMap[wId] = {
            status: record.status,
            wage: record.wage || "",
          };
          savedMap[wId] = true;
        }
      });

      setAttendanceData(initialMap);
      setSaved(savedMap);
    } catch (err) {
      console.error("Failed to load attendance log:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (workerId, status) => {
    setSaved((p) => ({ ...p, [workerId]: false }));
    setAttendanceData((p) => ({
      ...p,
      [workerId]: { status, wage: p[workerId]?.wage || "" },
    }));
  };

  const handleWageChange = (workerId, wage) => {
    setSaved((p) => ({ ...p, [workerId]: false }));
    setAttendanceData((p) => ({
      ...p,
      [workerId]: { ...p[workerId], wage },
    }));
  };

  const setWagePreset = (workerId, amount) => {
    handleWageChange(workerId, amount);
  };

  const saveAttendance = async (workerId) => {
    const data = attendanceData[workerId];
    if (!data || !data.status) return;

    if ((data.status === "Present" || data.status === "Half Day") && (!data.wage || Number(data.wage) <= 0)) {
      showMessage("Please enter a valid wage amount before saving", "warn");
      return;
    }

    setSaving((p) => ({ ...p, [workerId]: true }));

    try {
      await markAttendance({
        workerId,
        date: selectedDate,
        status: data.status,
        wage: data.status === "Absent" ? 0 : Number(data.wage),
      });
      setSaved((p) => ({ ...p, [workerId]: true }));
      showMessage("Attendance saved successfully", "success");
    } catch (err) {
      showMessage("Failed to save attendance", "error");
    } finally {
      setSaving((p) => ({ ...p, [workerId]: false }));
    }
  };

  // Save all marked records at once
  const saveAllAttendance = async () => {
    const workerIds = Object.keys(attendanceData).filter(
      (id) => attendanceData[id]?.status && !saved[id]
    );

    if (workerIds.length === 0) {
      showMessage("No unsaved attendance changes found", "warn");
      return;
    }

    for (const wId of workerIds) {
      await saveAttendance(wId);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const presentCount = Object.values(attendanceData).filter((d) => d.status === "Present").length;
  const absentCount = Object.values(attendanceData).filter((d) => d.status === "Absent").length;
  const halfDayCount = Object.values(attendanceData).filter((d) => d.status === "Half Day").length;
  const markedCount = Object.keys(attendanceData).length;

  const displayDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="att-layout">
      <Sidebar />

      <main className="att-main">
        {/* Top Bar */}
        <div className="att-topbar">
          <div className="att-topbar-left">
            <span className="att-eyebrow">DAILY ATTENDANCE SYSTEM</span>
            <h1 className="att-title">
              Attendance <span className="att-title-accent">Log</span>
            </h1>

            {/* Date Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  background: "#1E2640",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#FFF",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              />
              <span className="att-date">{displayDate}</span>
            </div>
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

        {/* Progress & Quick Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          {workers.length > 0 && (
            <div className="att-progress-wrap" style={{ flex: 1, minWidth: "250px", marginBottom: 0 }}>
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

          {workers.length > 0 && (
            <button
              onClick={saveAllAttendance}
              style={{
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                color: "#FFF",
                border: "none",
                padding: "8px 18px",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "0.88rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
            >
              💾 Save All Attendance
            </button>
          )}
        </div>

        {/* Global Message */}
        {message.text && (
          <div className={`att-message att-message--${message.type}`}>
            {message.type === "success" && "✓ "}
            {message.type === "warn" && "⚠ "}
            {message.type === "error" && "✕ "}
            {message.text}
          </div>
        )}

        {/* Worker Cards Grid */}
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>Loading workforce roster...</div>
        ) : workers.length === 0 ? (
          <div className="att-empty">
            <div className="att-empty-icon">👷</div>
            <p>No workers registered yet. Add workers first.</p>
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
                  <div className="att-toggle-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px" }}>
                    <button
                      className={`att-toggle att-toggle--present ${status === "Present" ? "active" : ""}`}
                      onClick={() => handleStatusChange(worker._id, "Present")}
                    >
                      Present
                    </button>
                    <button
                      className={`att-toggle ${status === "Half Day" ? "active" : ""}`}
                      style={{
                        background: status === "Half Day" ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.04)",
                        color: status === "Half Day" ? "#F59E0B" : "#CBD5E1",
                        border: status === "Half Day" ? "1px solid #F59E0B" : "1px solid transparent",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        padding: "6px 4px",
                      }}
                      onClick={() => handleStatusChange(worker._id, "Half Day")}
                    >
                      Half Day
                    </button>
                    <button
                      className={`att-toggle att-toggle--absent ${status === "Absent" ? "active" : ""}`}
                      onClick={() => handleStatusChange(worker._id, "Absent")}
                    >
                      Absent
                    </button>
                  </div>

                  {/* Wage Input & Presets */}
                  {(status === "Present" || status === "Half Day") && (
                    <div className="att-wage-row" style={{ flexDirection: "column", gap: "8px" }}>
                      <div className="att-wage-input-wrap" style={{ width: "100%" }}>
                        <span className="att-wage-prefix">₹</span>
                        <input
                          className="att-wage-input"
                          type="number"
                          placeholder="Enter daily wage"
                          value={entry?.wage || ""}
                          onChange={(e) => handleWageChange(worker._id, e.target.value)}
                        />
                      </div>

                      {/* Quick Presets */}
                      <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
                        {[500, 600, 700, 800, 1000].map((presetAmt) => (
                          <button
                            key={presetAmt}
                            onClick={() => setWagePreset(worker._id, presetAmt)}
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              color: "#CBD5E1",
                              fontSize: "0.72rem",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            ₹{presetAmt}
                          </button>
                        ))}
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
      </main>
    </div>
  );
}

export default Attendance;