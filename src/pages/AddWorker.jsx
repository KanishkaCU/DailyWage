import { useState, useEffect, useMemo } from "react";
import { addWorker, getWorkers, deleteWorker } from "../services/api";
import Sidebar from "../components/Sidebar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

import {
  UserPlus,
  Users,
  IndianRupee,
  CreditCard,
  TrendingUp,
  Trash2,
  ChevronRight,
  Phone,
  User,
  Sparkles,
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
      setMessage({
        text: "Please enter worker name and phone number.",
        type: "warn",
      });
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage({
        text: "Enter a valid 10-digit phone number.",
        type: "warn",
      });
      return;
    }

    try {
      setAdding(true);
      await addWorker({ name, phone, userId });
      setMessage({
        text: "Worker added successfully.",
        type: "success",
      });
      setName("");
      setPhone("");
      fetchWorkers();
    } catch (error) {
      setMessage({
        text: "Failed to add worker.",
        type: "error",
      });
    } finally {
      setAdding(false);
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
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

  const workersByMonth = useMemo(() => {
    const map = {};
    workers.forEach((worker) => {
      const date = new Date(worker.createdAt || Date.now());
      const key = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([month, count]) => ({
      month,
      count,
    }));
  }, [workers]);

  const paymentData = useMemo(() => {
    return workers
      .map((worker) => ({
        name: worker.name.split(" ")[0],
        total:
          worker.payments?.reduce(
            (sum, payment) => sum + (payment.amount || 0),
            0
          ) || 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [workers]);

  const totalPaid = workers.reduce(
    (sum, worker) =>
      sum +
      (worker.payments?.reduce(
        (s, payment) => s + (payment.amount || 0),
        0
      ) || 0),
    0
  );

  const totalTransactions = workers.reduce(
    (sum, worker) => sum + (worker.payments?.length || 0),
    0
  );

  const averagePaid =
    workers.length > 0 ? Math.round(totalPaid / workers.length) : 0;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Section */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Registration Terminal</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Add New Worker
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Register staff into your Daily Wage workforce directory.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Worker Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={adding}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all duration-200"
              >
                {adding ? (
                  <span>Adding Worker...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Register Worker</span>
                  </>
                )}
              </button>
            </div>

            {message.text && (
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
                  message.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : message.type === "warn"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}
              >
                {message.type === "success" && <Check className="w-4 h-4 shrink-0" />}
                {message.type !== "success" && <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}
          </div>

          {/* Quick Roster List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Roster
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {workers.length} Total
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading roster...</div>
            ) : workers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">No workers added yet.</div>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {workers.slice(0, 10).map((worker) => (
                  <div
                    key={worker._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-600/20 text-brand-400 font-bold flex items-center justify-center text-xs">
                        {worker.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{worker.name}</p>
                        <p className="text-[11px] text-slate-400">{worker.phone || "—"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/worker/${worker._id}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                        title="View Details"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(worker._id, worker.name)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                        title="Delete Worker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Overview & Charts */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Directory Summary
            </span>
            <h2 className="text-xl font-bold text-white">Workforce Analytics</h2>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white">{workers.length}</span>
              <p className="text-[11px] text-slate-400 font-medium">Workers</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <IndianRupee className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white">₹{totalPaid.toLocaleString()}</span>
              <p className="text-[11px] text-slate-400 font-medium">Total Paid</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white">{totalTransactions}</span>
              <p className="text-[11px] text-slate-400 font-medium">Transactions</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white">₹{averagePaid.toLocaleString()}</span>
              <p className="text-[11px] text-slate-400 font-medium">Avg Payment</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white">Worker Growth</h3>
                <p className="text-[11px] text-slate-400">Monthly registrations</p>
              </div>

              {workersByMonth.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No growth data.</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={workersByMonth}>
                    <defs>
                      <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "10px", color: "#FFF" }} />
                    <Area type="monotone" dataKey="count" stroke="#6366F1" fill="url(#growth)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white">Top Paid Workers</h3>
                <p className="text-[11px] text-slate-400">Highest payment totals</p>
              </div>

              {paymentData.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No payment records.</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={paymentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #334155", borderRadius: "10px", color: "#FFF" }} />
                    <Bar dataKey="total" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddWorker;