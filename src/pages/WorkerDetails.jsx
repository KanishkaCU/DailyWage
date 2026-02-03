import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getWorkers,
  getWorkerAttendance,
  addPayment,
  editPayment,
  deletePayment,
} from "../services/api";

function WorkerDetails() {
  const { id } = useParams();

  const [worker, setWorker] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editReason, setEditReason] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* ======================
     LOAD DATA
  ====================== */
  useEffect(() => {
    const loadData = async () => {
      const workers = await getWorkers();
      const currentWorker = workers.find((w) => w._id === id);
      setWorker(currentWorker);

      const attendance = await getWorkerAttendance(id).catch(() => []);
      setAttendanceRecords(attendance || []);
    };

    loadData();
  }, [id]);

  if (!worker) return <p>Loading...</p>;

  /* ======================
     CALCULATIONS (FIXED)
  ====================== */

  // ✅ TOTAL EARNED — ONLY FROM ATTENDANCE
  const totalEarned = attendanceRecords.reduce(
    (sum, record) => sum + (record.wage || 0),
    0
  );

  // ✅ TOTAL PAID — ONLY FROM PAYMENTS
  const totalPaid = (worker.payments || []).reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );

  // ✅ BALANCE
  const balance = totalEarned - totalPaid;

  /* ======================
     ACTIONS
  ====================== */

  const handleAddPayment = async () => {
    if (!amount) return;

    const updatedWorker = await addPayment(id, {
      amount: Number(amount),
      date: today,
      purpose: reason,
    });

    setWorker(updatedWorker);
    setAmount("");
    setReason("");
  };

  const handleEditPayment = async (index) => {
    const updatedWorker = await editPayment(id, index, {
      amount: Number(editAmount),
      purpose: editReason,
    });

    setWorker(updatedWorker);
    setEditingIndex(null);
  };

  const handleDeletePayment = async (index) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    const updatedWorker = await deletePayment(id, index);
    setWorker(updatedWorker);
  };

  /* ======================
     UI
  ====================== */
  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => window.history.back()}>← Back</button>

      <h2>{worker.name}</h2>
      <p>Phone: {worker.phone}</p>

      <hr />

      <p>
        <strong>Total Earned:</strong> ₹{totalEarned}
      </p>
      <p>
        <strong>Total Paid:</strong> ₹{totalPaid}
      </p>
      <p>
        <strong>Balance:</strong> ₹{balance}
      </p>

      <hr />

      <h3>Add Payment</h3>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button onClick={handleAddPayment}>Add</button>

      <h3 style={{ marginTop: "20px" }}>Payment History</h3>

      {worker.payments.length === 0 ? (
        <p>No payments yet</p>
      ) : (
        <ul>
          {worker.payments.map((payment, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              {editingIndex === index ? (
                <>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                  />
                  <button onClick={() => handleEditPayment(index)}>
                    Save
                  </button>
                  <button onClick={() => setEditingIndex(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {payment.date} – ₹{payment.amount}
                  {payment.purpose ? ` (${payment.purpose})` : ""}
                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() => {
                      setEditingIndex(index);
                      setEditAmount(payment.amount);
                      setEditReason(payment.purpose || "");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{ marginLeft: "6px", color: "red" }}
                    onClick={() => handleDeletePayment(index)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WorkerDetails;
