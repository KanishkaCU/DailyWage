import { useEffect, useState } from "react";
import { getWorkers, markAttendance, getAttendance } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import {
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Check,
} from "lucide-react";

function Attendance() {
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const { t } = useLanguage();
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

      let filteredWorkers = workerList || [];
      if (isToday) {
        filteredWorkers = filteredWorkers.filter((w) => {
          const existingRecord = initialMap[w._id];
          if (
            existingRecord &&
            savedMap[w._id] &&
            (existingRecord.status === "Present" || existingRecord.status === "Half Day")
          ) {
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
      showMessage(t("enterSalaryWarn"), "warn");
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
      showMessage(t("attendanceSaved"), "success");

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
      showMessage(t("noUnsavedChanges"), "warn");
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t("attendanceTitle")}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-stone-200 text-stone-900 text-xs sm:text-sm rounded-lg px-3 py-1.5 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-xs sm:text-sm text-stone-500">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
          </div>

          {workers.length > 0 && (
            <button
              onClick={saveAllAttendance}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{t("saveAll")}</span>
            </button>
          )}
        </div>

        {/* Info banner for today */}
        {isToday && (
          <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-xs sm:text-sm text-brand-900">
            {t("workersMovedMsg")}
          </div>
        )}

        {/* Notification */}
        {message.text && (
          <div
            className={`px-4 py-3 rounded-lg border text-xs sm:text-sm font-medium flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : message.type === "warn"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {message.type === "success" && <Check className="w-4 h-4 shrink-0" />}
            {message.type === "warn" && <AlertTriangle className="w-4 h-4 shrink-0" />}
            {message.type === "error" && <XCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Worker Cards */}
        {loading ? (
          <div className="py-16 text-center text-stone-400 text-sm">Loading...</div>
        ) : workers.length === 0 ? (
          <div className="py-16 text-center text-stone-400 text-sm">
            {isToday ? t("allMarkedMsg") : t("noWorkersDateMsg")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {workers.map((worker) => {
              const entry = attendanceData[worker._id];
              const status = entry?.status;
              const isSaved = saved[worker._id];
              const isSaving = saving[worker._id];

              return (
                <div
                  key={worker._id}
                  className={`bg-white border rounded-xl p-4 sm:p-5 space-y-4 shadow-xs transition-all ${
                    status === "Present"
                      ? "border-emerald-300 bg-emerald-50/20"
                      : status === "Absent"
                      ? "border-rose-300 bg-rose-50/20"
                      : status === "Half Day"
                      ? "border-amber-300 bg-amber-50/20"
                      : "border-stone-200"
                  }`}
                >
                  {/* Worker Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-sm border border-brand-200">
                        {worker.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-stone-900 text-sm sm:text-base">{worker.name}</h3>
                        <p className="text-xs text-stone-400">{worker.phone || "—"}</p>
                      </div>
                    </div>

                    {isSaved && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ {t("saved")}
                      </span>
                    )}
                  </div>

                  {/* Status Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <button
                      onClick={() => handleStatusChange(worker._id, "Present")}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                        status === "Present"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t("present")}
                    </button>
                    <button
                      onClick={() => handleStatusChange(worker._id, "Half Day")}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                        status === "Half Day"
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {t("halfDay")}
                    </button>
                    <button
                      onClick={() => handleStatusChange(worker._id, "Absent")}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 ${
                        status === "Absent"
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {t("absent")}
                    </button>
                  </div>

                  {/* Wage Input */}
                  {(status === "Present" || status === "Half Day") && (
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">
                        {t("salaryAmount")}
                      </label>
                      <input
                        type="number"
                        placeholder={t("enterAmount")}
                        value={entry?.wage || ""}
                        onChange={(e) => handleWageChange(worker._id, e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                  )}

                  {/* Save Button */}
                  {status && (
                    <button
                      onClick={() => saveAttendance(worker._id)}
                      disabled={isSaving || isSaved}
                      className={`w-full py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        isSaved
                          ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                          : "bg-brand-600 hover:bg-brand-700 text-white"
                      }`}
                    >
                      {isSaving ? (
                        t("saving")
                      ) : isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          {t("saved")}
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          {t("save")}
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