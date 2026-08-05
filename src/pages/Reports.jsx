import { useEffect, useState, useMemo } from "react";
import { getWorkers, getAttendance } from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../styles/reports.css";

function Reports() {
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [preset, setPreset] = useState("today");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [workers, setWorkers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch workers & attendance whenever date / range changes
  useEffect(() => {
    loadReportData();
  }, [preset, selectedDate, startDate, endDate]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const workerList = await getWorkers();
      setWorkers(workerList || []);

      let attList = [];
      if (preset === "range") {
        attList = await getAttendance({ startDate, endDate });
      } else {
        attList = await getAttendance(selectedDate);
      }
      setAttendanceRecords(attList || []);
    } catch (err) {
      console.error("Failed to load report data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Quick Preset Handler
  const handlePresetChange = (type) => {
    setPreset(type);
    const today = new Date();

    if (type === "today") {
      setSelectedDate(getTodayString());
    } else if (type === "yesterday") {
      const yest = new Date(today);
      yest.setDate(today.getDate() - 1);
      setSelectedDate(yest.toISOString().split("T")[0]);
    } else if (type === "thisWeek") {
      const curr = new Date();
      const first = curr.getDate() - curr.getDay() + 1;
      const monday = new Date(curr.setDate(first)).toISOString().split("T")[0];
      const sunday = getTodayString();
      setStartDate(monday);
      setEndDate(sunday);
      setPreset("range");
    } else if (type === "thisMonth") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      setStartDate(firstDay);
      setEndDate(getTodayString());
      setPreset("range");
    }
  };

  // Combine Workers with Attendance for the target date/range
  const reportRows = useMemo(() => {
    return workers.map((worker) => {
      // Find attendance record matching worker ID
      const recordsForWorker = attendanceRecords.filter(
        (r) =>
          r.workerId?._id === worker._id ||
          r.workerId === worker._id ||
          (typeof r.workerId === "object" && r.workerId?.name === worker.name)
      );

      // Latest or sum depending on preset
      const latestRecord = recordsForWorker[0];
      const status = latestRecord ? latestRecord.status : "Not Marked";

      const wageEarned = recordsForWorker.reduce(
        (sum, r) => sum + (r.wage || 0),
        0
      );

      const totalPaid = (worker.payments || []).reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      return {
        id: worker._id,
        name: worker.name,
        phone: worker.phone || "—",
        status: status,
        wage: wageEarned,
        totalPaid: totalPaid,
        balance: wageEarned - totalPaid,
        recordCount: recordsForWorker.length,
      };
    });
  }, [workers, attendanceRecords]);

  // Filtered Rows by Status & Search
  const filteredReportRows = useMemo(() => {
    return reportRows.filter((row) => {
      const matchesStatus =
        statusFilter === "all" ||
        row.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesSearch =
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.phone.includes(searchQuery);

      return matchesStatus && matchesSearch;
    });
  }, [reportRows, statusFilter, searchQuery]);

  // Calculated Metrics
  const totalWorkers = workers.length;
  const presentCount = reportRows.filter((r) => r.status === "Present").length;
  const absentCount = reportRows.filter((r) => r.status === "Absent").length;
  const halfDayCount = reportRows.filter((r) => r.status === "Half Day").length;
  const notMarkedCount = reportRows.filter((r) => r.status === "Not Marked").length;

  const totalWagesEarned = reportRows.reduce((sum, r) => sum + r.wage, 0);
  const totalPaymentsMade = reportRows.reduce((sum, r) => sum + r.totalPaid, 0);

  const presentPercentage =
    totalWorkers > 0 ? Math.round((presentCount / totalWorkers) * 100) : 0;

  // Chart Data Preparation
  const pieData = [
    { name: "Present", value: presentCount, color: "#10B981" },
    { name: "Absent", value: absentCount, color: "#EF4444" },
    { name: "Half Day", value: halfDayCount, color: "#F59E0B" },
    { name: "Not Marked", value: notMarkedCount, color: "#64748B" },
  ].filter((d) => d.value > 0);

  const barData = reportRows
    .slice(0, 8)
    .map((r) => ({
      name: r.name.split(" ")[0],
      Wage: r.wage,
      Paid: r.totalPaid,
    }));

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Worker Name", "Phone", "Status", "Wage Earned (₹)", "Total Paid (₹)"];
    const csvRows = [
      headers.join(","),
      ...filteredReportRows.map((r) =>
        [
          `"${r.name}"`,
          `"${r.phone}"`,
          `"${r.status}"`,
          r.wage,
          r.totalPaid,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Worker_Report_${preset === "range" ? `${startDate}_to_${endDate}` : selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-container">
      <Sidebar />

      <main className="reports-main">
        {/* Header */}
        <header className="reports-header">
          <div className="reports-title-section">
            <h1>
              <span>📈</span> Daily & Range Reports
            </h1>
            <p>Fetch workforce data, attendance status, and financial analytics by date.</p>
          </div>

          <div className="reports-header-actions">
            <button className="btn-export" onClick={handleExportCSV}>
              <span>📥</span> Export CSV
            </button>
            <button className="btn-print" onClick={handlePrint}>
              <span>🖨️</span> Print Report
            </button>
          </div>
        </header>

        {/* Date & Filter Controls */}
        <div className="reports-control-card">
          {/* Presets */}
          <div className="reports-presets">
            <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#94A3B8", marginRight: "6px" }}>
              SELECT PERIOD:
            </span>
            <button
              className={`preset-btn ${preset === "today" ? "active" : ""}`}
              onClick={() => handlePresetChange("today")}
            >
              Today
            </button>
            <button
              className={`preset-btn ${preset === "yesterday" ? "active" : ""}`}
              onClick={() => handlePresetChange("yesterday")}
            >
              Yesterday
            </button>
            <button
              className={`preset-btn ${preset === "thisWeek" ? "active" : ""}`}
              onClick={() => handlePresetChange("thisWeek")}
            >
              This Week
            </button>
            <button
              className={`preset-btn ${preset === "thisMonth" ? "active" : ""}`}
              onClick={() => handlePresetChange("thisMonth")}
            >
              This Month
            </button>
            <button
              className={`preset-btn ${preset === "range" ? "active" : ""}`}
              onClick={() => setPreset("range")}
            >
              Custom Range
            </button>
          </div>

          {/* Filters Row */}
          <div className="reports-filters-row">
            {preset !== "range" ? (
              <div className="filter-group">
                <label className="filter-label">Select Date</label>
                <input
                  type="date"
                  className="filter-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="filter-group">
                  <label className="filter-label">Start Date</label>
                  <input
                    type="date"
                    className="filter-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">End Date</label>
                  <input
                    type="date"
                    className="filter-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="filter-group">
              <label className="filter-label">Attendance Status</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Present">Present Only</option>
                <option value="Absent">Absent Only</option>
                <option value="Half Day">Half Day Only</option>
                <option value="Not Marked">Not Marked Only</option>
              </select>
            </div>

            <div className="filter-group" style={{ flex: 1.5 }}>
              <label className="filter-label">Search Worker</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Search by worker name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="reports-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-blue">👥</div>
            <div className="kpi-info">
              <span className="kpi-value">{totalWorkers}</span>
              <span className="kpi-title">Total Workers</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-green">✅</div>
            <div className="kpi-info">
              <span className="kpi-value">{presentCount} <span style={{ fontSize: "0.85rem", color: "#10B981" }}>({presentPercentage}%)</span></span>
              <span className="kpi-title">Present Workers</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-red">❌</div>
            <div className="kpi-info">
              <span className="kpi-value">{absentCount}</span>
              <span className="kpi-title">Absent Workers</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-purple">💰</div>
            <div className="kpi-info">
              <span className="kpi-value">₹{totalWagesEarned.toLocaleString()}</span>
              <span className="kpi-title">Total Wages Earned</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap kpi-amber">💸</div>
            <div className="kpi-info">
              <span className="kpi-value">₹{totalPaymentsMade.toLocaleString()}</span>
              <span className="kpi-title">Total Payments Made</span>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        {totalWorkers > 0 && (
          <div className="reports-charts-grid">
            {/* Pie Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Attendance Distribution</h3>
                <p>Status breakdown for selected period</p>
              </div>

              {pieData.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>No attendance recorded yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1E2640", border: "1px solid #334155", borderRadius: "10px", color: "#FFF" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bar Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Worker Wages Comparison</h3>
                <p>Earnings breakdown per worker</p>
              </div>

              {barData.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>No wage data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip contentStyle={{ background: "#1E2640", border: "1px solid #334155", borderRadius: "10px", color: "#FFF" }} />
                    <Bar dataKey="Wage" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* Detailed Worker Report Table */}
        <div className="reports-table-card">
          <div className="table-header-info">
            <h3>Detailed Worker Roster</h3>
            <span className="table-badge">{filteredReportRows.length} RECORDS FOUND</span>
          </div>

          {loading ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>Loading report records...</div>
          ) : filteredReportRows.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>
              No workers match the selected date and filters.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="ui-table">
                <thead>
                  <tr>
                    <th>Worker Name</th>
                    <th>Phone</th>
                    <th>Attendance Status</th>
                    <th>Wage Earned</th>
                    <th>Total Payments</th>
                    <th>Balance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportRows.map((row) => {
                    const statusClass =
                      row.status === "Present"
                        ? "status-present"
                        : row.status === "Absent"
                        ? "status-absent"
                        : row.status === "Half Day"
                        ? "status-halfday"
                        : "status-pending";

                    return (
                      <tr key={row.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                                color: "#FFF",
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.9rem",
                              }}
                            >
                              {row.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: "600", color: "#FFF" }}>{row.name}</span>
                          </div>
                        </td>
                        <td>{row.phone}</td>
                        <td>
                          <span className={`status-badge ${statusClass}`}>
                            {row.status === "Present" && "✓ "}
                            {row.status === "Absent" && "✕ "}
                            {row.status === "Half Day" && "⚡ "}
                            {row.status === "Not Marked" && "⏳ "}
                            {row.status}
                          </span>
                        </td>
                        <td style={{ fontWeight: "700", color: "#10B981" }}>
                          ₹{row.wage.toLocaleString()}
                        </td>
                        <td style={{ fontWeight: "600", color: "#CBD5E1" }}>
                          ₹{row.totalPaid.toLocaleString()}
                        </td>
                        <td>
                          <span
                            style={{
                              fontWeight: "700",
                              color: row.balance > 0 ? "#F59E0B" : row.balance === 0 ? "#10B981" : "#EF4444",
                            }}
                          >
                            ₹{row.balance.toLocaleString()}
                          </span>
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

export default Reports;
