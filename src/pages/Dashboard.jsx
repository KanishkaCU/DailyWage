import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkers, getAttendance, deleteWorker } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
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

  const { t } = useLanguage();
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

  const getTranslatedStatus = (status) => {
    if (status === "Present") return t("present");
    if (status === "Absent") return t("absent");
    if (status === "Half Day") return t("halfDay");
    return t("notMarked");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t("welcome")}, {username}</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => navigate("/add-worker")}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t("addWorker")}</span>
            </button>
            <button
              onClick={() => navigate("/attendance")}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs sm:text-sm shadow-xs transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-brand-600" />
              <span>{t("logAttendanceBtn")}</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-stone-900">{totalWorkers}</span>
                <p className="text-xs text-stone-500">{t("totalWorkers")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-stone-900">{presentTodayCount}</span>
                <p className="text-xs text-stone-500">{t("presentToday")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold text-stone-900">₹{totalSalaryGiven.toLocaleString()}</span>
                <p className="text-xs text-stone-500">{t("todaysSalaryGiven")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Table Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-base font-semibold text-stone-900">{t("workers")}</h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm rounded-lg pl-9 pr-4 py-2 outline-none transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-stone-400 text-sm">Loading...</div>
          ) : filteredWorkers.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              {t("noWorkersFound")}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">{t("name")}</th>
                    <th className="py-3 px-4">{t("phone")}</th>
                    <th className="py-3 px-4">{t("today")}</th>
                    <th className="py-3 px-4 text-right">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 text-sm">
                  {filteredWorkers.map((w, idx) => {
                    const todayRecord = todayAttendance.find(
                      (a) => a.workerId?._id === w._id || a.workerId === w._id
                    );
                    const status = todayRecord ? todayRecord.status : "Not Marked";

                    return (
                      <tr key={w._id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4 text-xs text-stone-400">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-stone-900">{w.name}</span>
                        </td>
                        <td className="py-3 px-4 text-stone-500">{w.phone || "—"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              status === "Present"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : status === "Absent"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : status === "Half Day"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {status === "Present" && <CheckCircle2 className="w-3 h-3" />}
                            {status === "Absent" && <XCircle className="w-3 h-3" />}
                            {status === "Half Day" && <Clock className="w-3 h-3" />}
                            {getTranslatedStatus(status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/worker/${w._id}`)}
                              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              {t("details")}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteWorker(w._id, w.name)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
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