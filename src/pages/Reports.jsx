import { useEffect, useState, useMemo } from "react";
import { getWorkers, getAttendance } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import {
  Download,
  Printer,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
} from "lucide-react";

function Reports() {
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const { t } = useLanguage();
  const [preset, setPreset] = useState("today");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

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
    return workers
      .map((worker) => {
        const recordsForWorker = attendanceRecords.filter(
          (r) =>
            r.workerId?._id === worker._id ||
            r.workerId === worker._id ||
            (typeof r.workerId === "object" && r.workerId?.name === worker.name)
        );

        const latestRecord = recordsForWorker[0];
        const status = latestRecord ? latestRecord.status : null;

        const totalSalaryGiven = recordsForWorker.reduce(
          (sum, r) => sum + (r.wage || 0),
          0
        );

        return {
          id: worker._id,
          name: worker.name,
          phone: worker.phone || "—",
          status,
          totalSalaryGiven,
        };
      })
      .filter((row) => row.status !== null);
  }, [workers, attendanceRecords]);

  const filteredReportRows = useMemo(() => {
    return reportRows.filter((row) => {
      return (
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.phone.includes(searchQuery)
      );
    });
  }, [reportRows, searchQuery]);

  const presentCount = reportRows.filter((r) => r.status === "Present").length;
  const absentCount = reportRows.filter((r) => r.status === "Absent").length;
  const halfDayCount = reportRows.filter((r) => r.status === "Half Day").length;
  const totalSalary = reportRows.reduce((sum, r) => sum + r.totalSalaryGiven, 0);

  const handleExportCSV = () => {
    const headers = [t("workerName"), t("phone"), t("status"), t("totalSalaryGivenCol") + " (₹)"];
    const csvRows = [
      headers.join(","),
      ...filteredReportRows.map((r) =>
        [`"${r.name}"`, `"${r.phone}"`, `"${r.status}"`, r.totalSalaryGiven].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Report_${preset === "range" ? `${startDate}_to_${endDate}` : selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTranslatedStatus = (status) => {
    if (status === "Present") return t("present");
    if (status === "Absent") return t("absent");
    if (status === "Half Day") return t("halfDay");
    return status;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t("reportsTitle")}</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {t("reportsSubtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-brand-600" />
              <span>{t("exportCsv")}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-brand-600" />
              <span>{t("print")}</span>
            </button>
          </div>
        </div>

        {/* Date Filter Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-4 no-print shadow-xs">
          {/* Period Presets */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs font-medium text-stone-400 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {t("period")}
            </span>
            {[
              { id: "today", label: t("todayPreset") },
              { id: "yesterday", label: t("yesterdayPreset") },
              { id: "thisWeek", label: t("thisWeekPreset") },
              { id: "thisMonth", label: t("thisMonthPreset") },
              { id: "range", label: t("customRange") },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  preset === p.id
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Date Inputs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
            {preset !== "range" ? (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-xs sm:text-sm rounded-lg px-3 py-2 outline-none w-full sm:w-auto"
              />
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:flex-initial">
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">{t("startDate")}</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-xs sm:text-sm rounded-lg px-3 py-1.5 outline-none"
                  />
                </div>
                <div className="flex-1 sm:flex-initial">
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">{t("endDate")}</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-xs sm:text-sm rounded-lg px-3 py-1.5 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="w-full sm:w-64">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder={t("searchWorker")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-stone-900">{presentCount}</span>
              <p className="text-[11px] text-stone-500">{t("present")}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-stone-900">{absentCount}</span>
              <p className="text-[11px] text-stone-500">{t("absent")}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-stone-900">{halfDayCount}</span>
              <p className="text-[11px] text-stone-500">{t("halfDay")}</p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-stone-900">₹{totalSalary.toLocaleString()}</span>
              <p className="text-[11px] text-stone-500">{t("totalSalary")}</p>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-900">{t("workerReport")}</h2>
            <span className="text-xs font-medium text-stone-400">
              {filteredReportRows.length} {t("records")}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-stone-400 text-sm">Loading...</div>
          ) : filteredReportRows.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              {t("noDataDate")}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    <th className="py-3 px-4">{t("workerName")}</th>
                    <th className="py-3 px-4">{t("phone")}</th>
                    <th className="py-3 px-4">{t("status")}</th>
                    <th className="py-3 px-4">{t("totalSalaryGivenCol")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 text-sm">
                  {filteredReportRows.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-stone-900">{row.name}</span>
                      </td>
                      <td className="py-3 px-4 text-stone-500">{row.phone}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.status === "Present"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : row.status === "Absent"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : row.status === "Half Day"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {row.status === "Present" && <CheckCircle2 className="w-3 h-3" />}
                          {row.status === "Absent" && <XCircle className="w-3 h-3" />}
                          {row.status === "Half Day" && <Clock className="w-3 h-3" />}
                          {getTranslatedStatus(row.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        ₹{row.totalSalaryGiven.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-stone-200">
                    <td colSpan="3" className="py-3 px-4 text-sm font-semibold text-stone-600">
                      Total
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-brand-700">
                      ₹{totalSalary.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reports;
