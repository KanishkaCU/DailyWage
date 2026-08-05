import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkers, getAttendance, deleteWorker } from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  Users,
  CalendarCheck,
  IndianRupee,
  Plus,
  Search,
  Trash2,
  ChevronRight,
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

  const totalWorkers = workers.length;
  const presentTodayCount = todayAttendance.filter((a) => a.status === "Present").length;
  const totalSalaryGiven = todayAttendance.reduce((sum, a) => sum + (a.wage || 0), 0);

  const filteredWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.phone && w.phone.includes(searchQuery))
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {username}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/add-worker")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Worker</span>
            </button>
            <button
              onClick={() => navigate("/attendance")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Log Attendance</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">{totalWorkers}</span>
                <p className="text-xs text-gray-500">Total Workers</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">{presentTodayCount}</span>
                <p className="text-xs text-gray-500">Present Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">₹{totalSalaryGiven.toLocaleString()}</span>
                <p className="text-xs text-gray-500">Today's Salary Given</p>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Table */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-base font-semibold text-gray-900">Workers</h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg pl-9 pr-4 py-2 outline-none transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading...</div>
          ) : filteredWorkers.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No workers found. Click "Add Worker" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Today</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {filteredWorkers.map((w, idx) => {
                    const todayRecord = todayAttendance.find(
                      (a) => a.workerId?._id === w._id || a.workerId === w._id
                    );
                    const status = todayRecord ? todayRecord.status : "Not Marked";

                    return (
                      <tr key={w._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 text-xs text-gray-400">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{w.name}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{w.phone || "—"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              status === "Present"
                                ? "bg-green-50 text-green-700"
                                : status === "Absent"
                                ? "bg-red-50 text-red-700"
                                : status === "Half Day"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {status === "Present" && <CheckCircle2 className="w-3 h-3" />}
                            {status === "Absent" && <XCircle className="w-3 h-3" />}
                            {status === "Half Day" && <Clock className="w-3 h-3" />}
                            {status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/worker/${w._id}`)}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              Details
                              <ChevronRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteWorker(w._id, w.name)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
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