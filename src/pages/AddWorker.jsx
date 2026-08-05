import { useState, useEffect } from "react";
import { addWorker, getWorkers, deleteWorker } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import {
  UserPlus,
  Trash2,
  ChevronRight,
  Phone,
  User,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddWorker() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const data = await getWorkers(userId);
      setWorkers(data || []);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone) {
      setMessage({ text: t("enterNameAndPhone"), type: "warn" });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage({ text: t("enterValidPhone"), type: "warn" });
      return;
    }

    try {
      setAdding(true);
      await addWorker({ name, phone, userId });
      setMessage({ text: t("workerAddedSuccess"), type: "success" });
      setName("");
      setPhone("");
      fetchWorkers();
    } catch (error) {
      setMessage({ text: t("failedAddWorker"), type: "error" });
    } finally {
      setAdding(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const handleDelete = async (id, workerName) => {
    if (!window.confirm(`Delete worker ${workerName}?`)) return;
    try {
      await deleteWorker(id);
      fetchWorkers();
    } catch (err) {
      alert("Failed to delete worker");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{t("addWorker")}</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{t("addWorkerSubtitle")}</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">{t("workerNameLabel")}</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">{t("phoneNumberLabel")}</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={adding}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-xs transition-colors"
          >
            {adding ? (
              t("adding")
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                {t("addWorker")}
              </>
            )}
          </button>

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
              {message.type === "success" ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </div>

        {/* Worker List */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-stone-900">{t("allWorkers")}</h2>
            <span className="text-xs font-medium text-stone-400">{workers.length} {t("total")}</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-stone-400 text-sm">Loading...</div>
          ) : workers.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-sm">{t("noWorkersFound")}</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {workers.map((worker) => (
                <div
                  key={worker._id}
                  className="flex items-center justify-between py-3 px-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-100 text-brand-800 font-semibold flex items-center justify-center text-sm shrink-0 border border-brand-200">
                      {worker.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">{worker.name}</p>
                      <p className="text-xs text-stone-400">{worker.phone || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/worker/${worker._id}`)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(worker._id, worker.name)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Delete Worker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddWorker;