import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import {
  getWorkers,
  getWorkerAttendance,
  addPayment,
  editPayment,
  deletePayment,
} from "../services/api";

import {
  ArrowLeft,
  User,
  Phone,
  IndianRupee,
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

function WorkerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editReason, setEditReason] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const workers = await getWorkers();
      const currentWorker = workers.find((w) => w._id === id);

      setWorker(currentWorker);

      const attendance = await getWorkerAttendance(id).catch(() => []);
      setAttendanceRecords(attendance || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!worker) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Loading worker profile...
        </div>
      </div>
    );
  }

  const totalEarned = attendanceRecords.reduce(
    (sum, record) => sum + (record.wage || 0),
    0
  );

  const totalPaid = (worker.payments || []).reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  const balance = totalEarned - totalPaid;

  const handleAddPayment = async () => {
    if (!amount || !reason) {
      alert("Please enter amount and reason");
      return;
    }

    try {
      const updatedWorker = await addPayment(id, {
        amount: Number(amount),
        reason: reason,
        date: today,
      });

      setWorker(updatedWorker);
      setAmount("");
      setReason("");
    } catch (err) {
      console.error(err);
      alert("Failed to add payment");
    }
  };

  const handleEditPayment = async (paymentId) => {
    try {
      const updatedWorker = await editPayment(id, paymentId, {
        amount: Number(editAmount),
        reason: editReason,
      });

      setWorker(updatedWorker);
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update payment");
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm("Delete this payment?")) return;

    try {
      const updatedWorker = await deletePayment(id, paymentId);
      setWorker(updatedWorker);
    } catch (err) {
      console.error(err);
      alert("Failed to delete payment");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Worker Profile Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-brand-600/30">
              {worker.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{worker.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active Worker
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                {worker.phone ? (
                  <a href={`tel:${worker.phone}`} className="hover:underline text-slate-300">
                    {worker.phone}
                  </a>
                ) : (
                  "No Phone Provided"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <IndianRupee className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">₹{totalEarned.toLocaleString()}</span>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Total Earned (Wages)</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-white">₹{totalPaid.toLocaleString()}</span>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Total Paid Disbursed</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className={`text-2xl font-extrabold ${balance > 0 ? "text-amber-400" : balance === 0 ? "text-emerald-400" : "text-rose-400"}`}>
              ₹{balance.toLocaleString()}
            </span>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Outstanding Balance</p>
          </div>
        </div>

        {/* Add Payment Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-400" />
            <span>Disburse Payment</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-brand-500 text-white text-xs font-semibold rounded-xl px-4 py-2.5 outline-none"
            />
            <input
              type="text"
              placeholder="Payment Reason (e.g. Advance / Weekly Settlement)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-slate-950 border border-slate-800 focus:border-brand-500 text-white text-xs font-semibold rounded-xl px-4 py-2.5 outline-none"
            />
            <button
              onClick={handleAddPayment}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/25 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Payment History</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
              {(worker.payments || []).length} Transactions
            </span>
          </div>

          {(worker.payments || []).length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">No payment records logged yet.</div>
          ) : (
            <div className="space-y-3">
              {(worker.payments || []).map((payment, index) => (
                <div
                  key={payment._id || index}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {editingIndex === index ? (
                    <div className="flex-1 flex flex-col sm:flex-row gap-3">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 outline-none"
                      />
                      <input
                        type="text"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditPayment(payment._id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-base font-extrabold text-emerald-400">
                          ₹{payment.amount.toLocaleString()}
                        </span>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">{payment.reason}</p>
                        <span className="text-[11px] text-slate-500">
                          {new Date(payment.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingIndex(index);
                            setEditAmount(payment.amount);
                            setEditReason(payment.reason);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          title="Edit Payment"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs"
                          title="Delete Payment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-brand-400" />
              <span>Attendance History</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
              {attendanceRecords.length} Logged Days
            </span>
          </div>

          {attendanceRecords.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">No attendance history logged yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Wage Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                  {attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium">
                        {new Date(record.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            record.status === "Present"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : record.status === "Absent"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        ₹{record.wage || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default WorkerDetails;
