import { useState, useEffect, useMemo } from "react";
import { addWorker, getWorkers } from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Area, AreaChart,
} from "recharts";
import "../styles/addWorker.css";

function AddWorker() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const data = await getWorkers(userId);
      setWorkers(data);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone) {
      setMessage({ text: "Please enter name and phone number", type: "warn" });
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage({ text: "Enter a valid 10-digit phone number", type: "warn" });
      return;
    }
    try {
      setAdding(true);
      await addWorker({ name, phone, userId });
      setMessage({ text: "Worker added successfully", type: "success" });
      setName("");
      setPhone("");
      fetchWorkers();
    } catch (error) {
      setMessage({ text: "Failed to add worker", type: "error" });
    } finally {
      setAdding(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const workersByMonth = useMemo(() => {
    const map = {};
    workers.forEach((w) => {
      const date = new Date(w.createdAt);
      const key = date.toLocaleString("default", { month: "short", year: "2-digit" });
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [workers]);

  const paymentData = useMemo(() => {
    return workers
      .map((w) => ({
        name: w.name.split(" ")[0],
        total: w.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        count: w.payments?.length || 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [workers]);

  const totalPaid = workers.reduce(
    (sum, w) => sum + (w.payments?.reduce((s, p) => s + (p.amount || 0), 0) || 0), 0
  );
  const totalTx = workers.reduce((sum, w) => sum + (w.payments?.length || 0), 0);
  const avgPaid = workers.length ? Math.round(totalPaid / workers.length) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="aw-tooltip">
        <span className="aw-tooltip-label">{label}</span>
        {payload.map((p, i) => (
          <span key={i} style={{ color: p.color }}>
            {p.name}: {p.name === "total" ? `₹${p.value.toLocaleString()}` : p.value}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="aw-layout">
      <Sidebar />

      <div className="aw-page">
        {/* ── LEFT ── */}
        <aside className="aw-left">
          {/* Header */}
          <div className="aw-header">
            <div className="aw-header-eyebrow">WORKFORCE MANAGEMENT</div>
            <h1 className="aw-title">Add <span className="aw-title-accent">Worker</span></h1>
            <p className="aw-subtitle">Register a new team member to the system</p>
          </div>

          {/* Form */}
          <div className="aw-form-card">
            <div className="aw-form-card-header">
              <div className="aw-form-card-dot" />
              <span>NEW ENTRY</span>
            </div>

            <div className="aw-field">
              <label className="aw-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                Worker Name
              </label>
              <input
                className="aw-input"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="aw-field">
              <label className="aw-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.48 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 15z"/></svg>
                Phone Number
              </label>
              <input
                className="aw-input"
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <button
              className={`aw-submit-btn ${adding ? "aw-submit-btn--loading" : ""}`}
              onClick={handleSubmit}
              disabled={adding}
            >
              {adding ? (
                <span className="aw-spinner" />
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Register Worker
                </>
              )}
            </button>

            {message.text && (
              <div className={`aw-message aw-message--${message.type}`}>
                {message.type === "success" && "✓ "}
                {message.type === "warn" && "⚠ "}
                {message.type === "error" && "✕ "}
                {message.text}
              </div>
            )}
          </div>

          {/* Worker List */}
          <div className="aw-list-card">
            <div className="aw-list-header">
              <span className="aw-list-title">ROSTER</span>
              <span className="aw-list-badge">{workers.length}</span>
            </div>

            {loading ? (
              <div className="aw-list-loading">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aw-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ) : workers.length === 0 ? (
              <div className="aw-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <p>No workers yet</p>
              </div>
            ) : (
              <div className="aw-roster">
                {workers.map((worker, idx) => (
                  <div
                    key={worker._id}
                    className="aw-roster-item"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="aw-roster-rank">#{idx + 1}</div>
                    <div className="aw-roster-avatar">
                      {worker.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="aw-roster-info">
                      <span className="aw-roster-name">{worker.name}</span>
                      <span className="aw-roster-phone">{worker.phone || "—"}</span>
                    </div>
                    <div className="aw-roster-indicator" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="aw-back-btn" onClick={() => window.history.back()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
        </aside>

        {/* ── RIGHT ── */}
        <main className="aw-right">
          <div className="aw-right-header">
            <span className="aw-right-eyebrow">ANALYTICS</span>
            <h2 className="aw-right-title">Performance Overview</h2>
          </div>

          {/* KPI Strip */}
          <div className="aw-kpis">
            <div className="aw-kpi">
              <div className="aw-kpi-icon aw-kpi-icon--blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="aw-kpi-body">
                <span className="aw-kpi-val">{workers.length}</span>
                <span className="aw-kpi-lbl">Total Workers</span>
              </div>
              <div className="aw-kpi-bar" style={{ "--fill": "60%" }} />
            </div>

            <div className="aw-kpi">
              <div className="aw-kpi-icon aw-kpi-icon--amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div className="aw-kpi-body">
                <span className="aw-kpi-val">₹{totalPaid.toLocaleString()}</span>
                <span className="aw-kpi-lbl">Total Disbursed</span>
              </div>
              <div className="aw-kpi-bar aw-kpi-bar--amber" style={{ "--fill": "80%" }} />
            </div>

            <div className="aw-kpi">
              <div className="aw-kpi-icon aw-kpi-icon--green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div className="aw-kpi-body">
                <span className="aw-kpi-val">{totalTx}</span>
                <span className="aw-kpi-lbl">Transactions</span>
              </div>
              <div className="aw-kpi-bar aw-kpi-bar--green" style={{ "--fill": "45%" }} />
            </div>

            <div className="aw-kpi">
              <div className="aw-kpi-icon aw-kpi-icon--purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
              </div>
              <div className="aw-kpi-body">
                <span className="aw-kpi-val">₹{avgPaid.toLocaleString()}</span>
                <span className="aw-kpi-lbl">Avg / Worker</span>
              </div>
              <div className="aw-kpi-bar aw-kpi-bar--purple" style={{ "--fill": "35%" }} />
            </div>
          </div>

          {/* Charts Row */}
          <div className="aw-charts">
            {/* Area Chart */}
            <div className="aw-chart-card aw-chart-card--wide">
              <div className="aw-chart-header">
                <span className="aw-chart-title">WORKER GROWTH</span>
                <span className="aw-chart-sub">Monthly onboarding trend</span>
              </div>
              {workersByMonth.length === 0 ? (
                <div className="aw-chart-empty">
                  <p>Add workers to see trends</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={workersByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" name="workers" stroke="#f59e0b" strokeWidth={2} fill="url(#growthGrad)" dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#f59e0b" }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bar Chart */}
            <div className="aw-chart-card">
              <div className="aw-chart-header">
                <span className="aw-chart-title">TOP EARNERS</span>
                <span className="aw-chart-sub">Total paid out (₹)</span>
              </div>
              {paymentData.filter((d) => d.total > 0).length === 0 ? (
                <div className="aw-chart-empty">
                  <p>No payment data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={paymentData} barSize={20} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" name="total" radius={[4, 4, 0, 0]}>
                      {paymentData.map((_, i) => (
                        <rect key={i} fill={i === 0 ? "#f59e0b" : "#374151"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="aw-activity-card">
            <div className="aw-chart-header">
              <span className="aw-chart-title">RECENT ADDITIONS</span>
              <span className="aw-chart-sub">Last {Math.min(workers.length, 4)} workers registered</span>
            </div>
            {workers.length === 0 ? (
              <p className="aw-chart-empty-text">No activity yet</p>
            ) : (
              <div className="aw-activity-list">
                {[...workers].slice(0, 4).map((w, i) => (
                  <div key={w._id} className="aw-activity-item" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="aw-activity-avatar">{w.name.charAt(0).toUpperCase()}</div>
                    <div className="aw-activity-info">
                      <span className="aw-activity-name">{w.name}</span>
                      <span className="aw-activity-meta">{w.phone || "No phone"} · {new Date(w.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                    <div className="aw-activity-pill">
                      {w.payments?.length || 0} txn
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddWorker;