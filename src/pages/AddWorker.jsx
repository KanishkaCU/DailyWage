import { useState, useEffect } from "react";
import { addWorker, getWorkers, deleteWorker } from "../services/api";
import Sidebar from "../components/Sidebar";
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
      setMessage({ text: "Please enter worker name and phone number.", type: "warn" });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage({ text: "Enter a valid 10-digit phone number.", type: "warn" });
      return;
    }

    try {
      setAdding(true);
      await addWorker({ name, phone, userId });
      setMessage({ text: "Worker added successfully.", type: "success" });
      setName("");
      setPhone("");
      fetchWorkers();
    } catch (error) {
      setMessage({ text: "Failed to add worker.", type: "error" });
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Worker</h1>
          <p className="text-sm text-gray-500 mt-0.5">Register new workers to your team</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Worker Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={adding}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors"
          >
            {adding ? (
              "Adding..."
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Add Worker
              </>
            )}
          </button>

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
              {message.type === "success" ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message.text}
            </div>
          )}
        </div>

        {/* Worker List */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">All Workers</h2>
            <span className="text-xs font-medium text-gray-400">{workers.length} total</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : workers.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">No workers added yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {workers.map((worker) => (
                <div
                  key={worker._id}
                  className="flex items-center justify-between py-3 px-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 font-semibold flex items-center justify-center text-sm">
                      {worker.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{worker.name}</p>
                      <p className="text-xs text-gray-400">{worker.phone || "—"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => navigate(`/worker/${worker._id}`)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(worker._id, worker.name)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
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