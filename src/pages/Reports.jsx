import { useEffect, useState, useMemo } from "react";
import { getWorkers, getAttendance } from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Download,
  Printer,
  Search,
  Filter,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  CreditCard,
  FileSpreadsheet,
} from "lucide-react";

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
      setStartDate(monday);
      setEndDate(getTodayString());
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

  const reportRows = useMemo(() => {
    return workers.map((worker) => {
      const recordsForWorker = attendanceRecords.filter(
        (r) =>
          r.workerId?._id === worker._id ||
          r.workerId === worker._id ||
          (typeof r.workerId === "object" && r.workerId?.name === worker.name)
      );

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

  const pieData = [
    { name: "Present", value: presentCount, color: "#10B981" },
    { name: "Absent", value: absentCount, color: "#EF4444" },
    { name: "Half Day", value: halfDayCount, color: "#F59E0B" },
    { name: "Not Marked", value: notMarkedCount, color: "#64748B" },
  ].filter((d) => d.value > 0);

  const barData = reportRows.slice(0, 8).map((r) => ({
    name: r.name.split(" ")[0],
    Wage: r.wage,
    Paid: r.totalPaid,
  }));

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Workforce Analytics</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Daily & Range Reports
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Filter workforce attendance data, wages, and payments by date.
            </p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600/10 hover:bg-brand-600/20 text-brand-400 border border-brand-500/30 font-semibold text-sm transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Control & Filter Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5 no-print">
          {/* Period Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              Period:
            </span>
            {[
              { id: "today", label: "Today" },
              { id: "yesterday", label: "Yesterday" },
              { id: "thisWeek", label: "This Week" },
              { id: "thisMonth", label: "This Month" },
              { id: "range", label: "Custom Range" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  preset === p.id
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {preset !== "range" ? (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Attendance Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Present">Present Only</option>
                <option value="Absent">Absent Only</option>
                <option value="Half Day">Half Day Only</option>
                <option value="Not Marked">Not Marked Only</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Search Worker
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Worker name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-slate-100 text-xs rounded-xl pl-9 pr-3.5 py-2.5 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white">{totalWorkers}</span>
              <p className="text-[11px] font-medium text-slate-400">Total Workers</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white">
                {presentCount} <span className="text-xs text-emerald-400">({presentPercentage}%)</span>
              </span>
              <p className="text-[11px] font-medium text-slate-400">Present Workers</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white">{absentCount}</span>
              <p className="text-[11px] font-medium text-slate-400">Absent Workers</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white">₹{totalWagesEarned.toLocaleString()}</span>
              <p className="text-[11px] font-medium text-slate-400">Total Wages Earned</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white">₹{totalPaymentsMade.toLocaleString()}</span>
              <p className="text-[11px] font-medium text-slate-400">Total Payments Made</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {totalWorkers > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Attendance Distribution</h3>
                <p className="text-xs text-slate-400">Breakdown for selected date period</p>
              </div>

              {pieData.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm">No attendance recorded yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <RePieChart>
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
                    <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "10px", color: "#FFF" }} />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Worker Wages Comparison</h3>
                <p className="text-xs text-slate-400">Wage earnings per worker</p>
              </div>

              {barData.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm">No wage data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <ReBarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "10px", color: "#FFF" }} />
                    <Bar dataKey="Wage" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* Detailed Worker Report Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Detailed Worker Report</h2>
              <p className="text-xs text-slate-400">Worker-by-worker record breakdown</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {filteredReportRows.length} RECORDS
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">Loading report records...</div>
          ) : filteredReportRows.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No workers match the selected date and filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Worker Name</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Attendance Status</th>
                    <th className="py-3 px-4">Wage Earned</th>
                    <th className="py-3 px-4">Total Payments</th>
                    <th className="py-3 px-4">Balance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                  {filteredReportRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                            {row.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-400">{row.phone}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            row.status === "Present"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : row.status === "Absent"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : row.status === "Half Day"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {row.status === "Present" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {row.status === "Absent" && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                          {row.status === "Half Day" && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        ₹{row.wage.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-300">
                        ₹{row.totalPaid.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold ${
                            row.balance > 0
                              ? "text-amber-400"
                              : row.balance === 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          ₹{row.balance.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
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
