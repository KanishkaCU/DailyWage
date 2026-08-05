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

  const isToday = selectedDate === getTodayString();

  useEffect(() => {
    fetchWorkersAndAttendance();
  }, [selectedDate]);

  const fetchWorkersAndAttendance = async () => {
    try {
      setLoading(true);
      const workerList = await getWorkers();
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

      // Filter: If today, hide workers already marked present/half day (saved to DB)
      let filteredWorkers = workerList || [];
      if (isToday) {
        filteredWorkers = filteredWorkers.filter((w) => {
          const existingRecord = initialMap[w._id];
          // Show if no record yet, or if record exists but not saved yet (shouldn't happen on load)
          // Hide if already saved as Present or Half Day
          if (existingRecord && savedMap[w._id] && (existingRecord.status === "Present" || existingRecord.status === "Half Day")) {
            return false;
          }
          return true;
        });
      }

      setWorkers(filteredWorkers);
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

  const saveAttendance = async (workerId) => {
    const data = attendanceData[workerId];
    if (!data || !data.status) return;

    if (
      (data.status === "Present" || data.status === "Half Day") &&
      (!data.wage || Number(data.wage) <= 0)
    ) {
      showMessage("Please enter the salary amount before saving", "warn");
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

      // If today and marked present/half day, remove worker from list after a short delay
      if (isToday && (data.status === "Present" || data.status === "Half Day")) {
        setTimeout(() => {
          setWorkers((prev) => prev.filter((w) => w._id !== workerId));
        }, 800);
      }
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
      showMessage("No unsaved changes", "warn");
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

  const markedCount = Object.keys(attendanceData).filter(
    (id) => attendanceData[id]?.status
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-500">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
          </div>

          {workers.length > 0 && (
            <button
              onClick={saveAllAttendance}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save All</span>
            </button>
          )}
        </div>

        {/* Info banner for today */}
        {isToday && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
            Workers marked <strong>Present</strong> or <strong>Half Day</strong> will move to the Reports page and reappear here tomorrow.
          </div>
        )}

        {/* Notification */}
        {message.text && (
          <div
            className={`px-4 py-3 rounded-lg border text-sm font-medium flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : message.type === "warn"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.type === "success" && <Check className="w-4 h-4" />}
            {message.type === "warn" && <AlertTriangle className="w-4 h-4" />}
            {message.type === "error" && <XCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Worker Cards */}
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading...</div>
        ) : workers.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {isToday
              ? "All workers have been marked for today. Check the Reports page."
              : "No workers to show for this date."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker) => {
              const entry = attendanceData[worker._id];
              const status = entry?.status;
              const isSaved = saved[worker._id];
              const isSaving = saving[worker._id];

              return (
                <div
                  key={worker._id}
                  className={`bg-white border rounded-xl p-5 space-y-4 transition-all ${
                    status === "Present"
                      ? "border-green-200 bg-green-50/30"
                      : status === "Absent"
                      ? "border-red-200 bg-red-50/30"
                      : status === "Half Day"
                      ? "border-amber-200 bg-amber-50/30"
                      : "border-gray-200"
                  }`}
                >
                  {/* Worker Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-sm">
                        {worker.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                        <p className="text-xs text-gray-400">{worker.phone || "—"}</p>
                      </div>
                    </div>

                    {isSaved && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-600">
                        ✓ Saved
                      </span>
                    )}
                  </div>

                  {/* Status Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleStatusChange(worker._id, "Present")}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                        status === "Present"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Present
                    </button>
                    <button
                      onClick={() => handleStatusChange(worker._id, "Half Day")}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                        status === "Half Day"
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Half Day
                    </button>
                    <button
                      onClick={() => handleStatusChange(worker._id, "Absent")}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                        status === "Absent"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Absent
                    </button>
                  </div>

                  {/* Wage Input - Manual Entry Only */}
                  {(status === "Present" || status === "Half Day") && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Salary Amount (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={entry?.wage || ""}
                        onChange={(e) => handleWageChange(worker._id, e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                  )}

                  {/* Save Button */}
                  {status && (
                    <button
                      onClick={() => saveAttendance(worker._id)}
                      disabled={isSaving || isSaved}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        isSaved
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-brand-600 hover:bg-brand-700 text-white"
                      }`}
                    >
                      {isSaving ? (
                        "Saving..."
                      ) : isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-500" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save
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