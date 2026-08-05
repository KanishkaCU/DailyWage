import { useEffect, useState } from "react";
import { getWorkers, markAttendance, getAttendance } from "../services/api";
import Sidebar from "../components/Sidebar";
import {
  CalendarCheck,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Check,
  Sparkles,
  IndianRupee,
} from "lucide-react";

function Attendance() {
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [workers, setWorkers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkersAndAttendance();
  }, [selectedDate]);

  const fetchWorkersAndAttendance = async () => {
    try {
      setLoading(true);
      const workerList = await getWorkers();
      setWorkers(workerList || []);

      const attList = await getAttendance(selectedDate);

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

    if (
      (data.status === "Present" || data.status === "Half Day") &&
      (!data.wage || Number(data.wage) <= 0)
    ) {
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
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Attendance System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Attendance Log
            </h1>

            {/* Date Selector */}
            <div className="flex items-center gap-3 mt-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white font-medium text-xs rounded-xl px-3 py-1.5 outline-none focus:border-brand-500 cursor-pointer"
              />
              <span className="text-sm font-semibold text-slate-300">{displayDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {presentCount} Present
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <XCircle className="w-3.5 h-3.5" />
              {absentCount} Absent
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {markedCount}/{workers.length} Marked
            </span>
          </div>
        </div>

        {/* Progress Tracker & Bulk Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          {workers.length > 0 && (
            <div className="flex-1 max-w-md">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
                <span>Logging Progress</span>
                <span className="text-brand-400">{Math.round((markedCount / workers.length) * 100)}% Logged</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-300"
                  style={{ width: `${(markedCount / workers.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {workers.length > 0 && (
            <button
              onClick={saveAllAttendance}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              <span>Save All Changes</span>
            </button>
          )}
        </div>

        {/* Banner Notification */}
        {message.text && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : message.type === "warn"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            }`}
          >
            {message.type === "success" && <Check className="w-4 h-4" />}
            {message.type === "warn" && <AlertTriangle className="w-4 h-4" />}
            {message.type === "error" && <XCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Worker Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">Loading workforce roster...</div>
        ) : workers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No workers registered yet. Add workers first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workers.map((worker) => {
              const entry = attendanceData[worker._id];
              const status = entry?.status;
              const isSaved = saved[worker._id];
              const isSaving = saving[worker._id];

              return (
                <div
                  key={worker._id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-sm space-y-4 transition-all duration-200 ${
                    status === "Present"
                      ? "border-emerald-500/40 bg-emerald-950/10"
                      : status === "Absent"
                      ? "border-rose-500/40 bg-rose-950/10"
                      : status === "Half Day"
                      ? "border-amber-500/40 bg-amber-950/10"
                      : "border-slate-800"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
                        {worker.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">{worker.name}</h3>
                        <p className="text-xs text-slate-400">{worker.phone || "—"}</p>
                      </div>
                    </div>

                    {isSaved ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Saved
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Status Toggle Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleStatusChange(worker._id, "Present")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-1 ${
                        status === "Present"
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(worker._id, "Half Day")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-1 ${
                        status === "Half Day"
                          ? "bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Half Day</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(worker._id, "Absent")}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-1 ${
                        status === "Absent"
                          ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>
                  </div>

                  {/* Wage Input & Presets */}
                  {(status === "Present" || status === "Half Day") && (
                    <div className="space-y-2 pt-1">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          placeholder="Enter daily wage"
                          value={entry?.wage || ""}
                          onChange={(e) => handleWageChange(worker._id, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-white text-xs font-semibold rounded-xl pl-8 pr-3 py-2 outline-none"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Quick:</span>
                        {[500, 600, 700, 800, 1000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setWagePreset(worker._id, amt)}
                            className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-semibold transition-colors shrink-0"
                          >
                            ₹{amt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Individual Save Button */}
                  {status && (
                    <button
                      onClick={() => saveAttendance(worker._id)}
                      disabled={isSaving || isSaved}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isSaved
                          ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                          : "bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/25"
                      }`}
                    >
                      {isSaving ? (
                        <span>Saving...</span>
                      ) : isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Entry</span>
                        </>
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