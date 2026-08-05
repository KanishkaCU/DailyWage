import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkers, getAttendance, deleteWorker } from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  Users,
  CalendarCheck,
  IndianRupee,
  BarChart3,
  Plus,
  Search,
  Trash2,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

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

  // Metrics
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
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Bar Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()}, {username}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Executive Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">{displayDate}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/add-worker")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Worker</span>
            </button>

            <button
              onClick={() => navigate("/attendance")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-sm transition-all duration-200"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Log Attendance</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => navigate("/add-worker")}
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-brand-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-colors" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold text-white">{totalWorkers}</span>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Total Registered Workers</p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => navigate("/attendance")}
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white">{presentTodayCount}</span>
                <span className="text-xs font-bold text-emerald-400">({attendanceRate}%)</span>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Present Today</p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => navigate("/reports")}
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <IndianRupee className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-extrabold text-white">₹{totalPaid.toLocaleString()}</span>
              <p className="text-xs font-medium text-slate-400 mt-0.5">Total Payments Disbursed</p>
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => navigate("/reports")}
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="mt-4">
              <span className="text-lg font-bold text-white">Date Analytics</span>
              <p className="text-xs font-medium text-slate-400 mt-0.5">View Reports & Data</p>
            </div>
          </div>
        </div>

        {/* Workforce Roster Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Active Workforce Roster</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {totalWorkers} Total
                </span>
              </h2>
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search worker by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2.5 transition-colors outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">Loading workforce roster...</div>
          ) : filteredWorkers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No workers found matching your search. Click "Add Worker" to register staff.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Worker Name</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Today Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                  {filteredWorkers.map((w, idx) => {
                    const todayRecord = todayAttendance.find(
                      (a) => a.workerId?._id === w._id || a.workerId === w._id
                    );
                    const status = todayRecord ? todayRecord.status : "Not Marked";

                    return (
                      <tr key={w._id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                              {w.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-white">{w.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-400">
                          {w.phone || "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              status === "Present"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : status === "Absent"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                : status === "Half Day"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {status === "Present" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {status === "Absent" && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                            {status === "Half Day" && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                            {status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/worker/${w._id}`)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteWorker(w._id, w.name)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                              title="Delete Worker"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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