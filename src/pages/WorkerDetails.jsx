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
  Phone,
  IndianRupee,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  CalendarCheck,
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
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  const totalSalaryGiven = attendanceRecords.reduce(
    (sum, record) => sum + (record.wage || 0),
    0
  );

  const handleAddPayment = async () => {
    if (!amount || !reason) {
      alert("Please enter amount and reason");
      return;
    }

    try {
      const updatedWorker = await addPayment(id, {
        amount: Number(amount),
        reason,
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Worker Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-xl">
              {worker.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{worker.name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" />
                {worker.phone ? (
                  <a href={`tel:${worker.phone}`} className="hover:underline">
                    {worker.phone}
                  </a>
                ) : (
                  "No phone"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Total Salary Given */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">₹{totalSalaryGiven.toLocaleString()}</span>
              <p className="text-xs text-gray-500">Total Salary Given</p>
            </div>
          </div>
        </div>

        {/* Add Payment */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Record Payment</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg px-3 py-2 outline-none"
            />
            <input
              type="text"
              placeholder="Reason (e.g. Advance)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-gray-900 text-sm rounded-lg px-3 py-2 outline-none"
            />
            <button
              onClick={handleAddPayment}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Payment History</h2>
            <span className="text-xs text-gray-400">{(worker.payments || []).length} records</span>
          </div>

          {(worker.payments || []).length === 0 ? (
            <div className="py-6 text-center text-gray-400 text-sm">No payments yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(worker.payments || []).map((payment, index) => (
                <div key={payment._id || index} className="py-3 flex items-center justify-between gap-3">
                  {editingIndex === index ? (
                    <div className="flex-1 flex flex-col sm:flex-row gap-2">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-1.5 outline-none w-28"
                      />
                      <input
                        type="text"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-1.5 outline-none"
                      />
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleEditPayment(payment._id)}
                          className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium inline-flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium inline-flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{payment.amount.toLocaleString()}
                        </span>
                        <p className="text-xs text-gray-500">{payment.reason}</p>
                        <span className="text-[11px] text-gray-400">
                          {new Date(payment.date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingIndex(index);
                            setEditAmount(payment.amount);
                            setEditReason(payment.reason);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
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
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-brand-600" />
              Attendance History
            </h2>
            <span className="text-xs text-gray-400">{attendanceRecords.length} days</span>
          </div>

          {attendanceRecords.length === 0 ? (
            <div className="py-6 text-center text-gray-400 text-sm">No attendance logged yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {attendanceRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(record.date).toLocaleDateString("en-IN", {
                          weekday: "short", day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.status === "Present"
                              ? "bg-green-50 text-green-700"
                              : record.status === "Absent"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
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
