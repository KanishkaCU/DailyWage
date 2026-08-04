import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import {
  getWorkers,
  getWorkerAttendance,
  addPayment,
  editPayment,
  deletePayment,
} from "../services/api";

import "../styles/WorkerDetails";

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

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const workers = await getWorkers();

      const currentWorker = workers.find(
        (w) => w._id === id
      );

      setWorker(currentWorker);

      const attendance =
        await getWorkerAttendance(id).catch(() => []);

      setAttendanceRecords(attendance || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!worker) {
    return (
      <div className="wd-loading">
        Loading...
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
      const updatedWorker = await editPayment(
        id,
        paymentId,
        {
          amount: Number(editAmount),
          reason: editReason,
        }
      );

      setWorker(updatedWorker);
      setEditingIndex(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update payment");
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm("Delete this payment?"))
      return;

    try {
      const updatedWorker =
        await deletePayment(id, paymentId);

      setWorker(updatedWorker);
    } catch (err) {
      console.error(err);
      alert("Failed to delete payment");
    }
  };

  return (
        <div className="wd-layout">

      <Sidebar />

      <main className="wd-main">

        <button
          className="wd-back"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

        {/* ================= PROFILE ================= */}

        <div className="wd-profile">

          <div className="wd-avatar">
            {worker.name.charAt(0).toUpperCase()}
          </div>

          <div className="wd-info">

            <h1 className="wd-name">
              {worker.name}
            </h1>

            <p className="wd-phone">
              📞 {worker.phone || "No Phone Number"}
            </p>

          </div>

        </div>

        {/* ================= SUMMARY ================= */}

        <div className="wd-stats">

          <div className="wd-stat">

            <h2>
              ₹{totalEarned.toLocaleString()}
            </h2>

            <p>
              Total Earned
            </p>

          </div>

          <div className="wd-stat">

            <h2>
              ₹{totalPaid.toLocaleString()}
            </h2>

            <p>
              Total Paid
            </p>

          </div>

          <div className="wd-stat">

            <h2>
              ₹{balance.toLocaleString()}
            </h2>

            <p>
              Balance
            </p>

          </div>

        </div>

        {/* ================= ADD PAYMENT ================= */}

        <div className="wd-payment">

          <h3>
            💰 Add Payment
          </h3>

          <div className="wd-form">

            <input
              className="wd-input"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

            <input
              className="wd-input"
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
            />

            <button
              className="wd-add-btn"
              onClick={handleAddPayment}
            >
              + Add Payment
            </button>

          </div>

        </div>

        {/* ================= PAYMENT HISTORY ================= */}

        <div className="wd-history">

          <h3>
            📜 Payment History
          </h3>

          {(worker.payments || []).length === 0 ? (

            <div className="wd-empty">

              <div className="wd-empty-icon">
                💰
              </div>

              <p>
                No payments recorded yet.
              </p>

            </div>

          ) : (

            (worker.payments || []).map(
              (payment, index) => (
                              <div
                key={index}
                className="wd-payment-card"
              >

                {editingIndex === index ? (

                  <>

                    <div className="wd-payment-left">

                      <input
                        className="wd-input"
                        type="number"
                        value={editAmount}
                        onChange={(e) =>
                          setEditAmount(e.target.value)
                        }
                      />

                      <input
                        className="wd-input"
                        type="text"
                        value={editReason}
                        onChange={(e) =>
                          setEditReason(e.target.value)
                        }
                      />

                    </div>

                    <div className="wd-actions">

                      <button
                        className="wd-edit"
                        onClick={() =>
                          handleEditPayment(payment._id)
                        }
                      >
                        💾 Save
                      </button>

                      <button
                        className="wd-delete"
                        onClick={() =>
                          setEditingIndex(null)
                        }
                      >
                        ✖ Cancel
                      </button>

                    </div>

                  </>

                ) : (

                  <>

                    <div className="wd-payment-left">

                      <span className="wd-payment-amount">
                        ₹{payment.amount}
                      </span>

                      <span className="wd-payment-purpose">
                        {payment.reason}
                      </span>

                      <span className="wd-payment-date">
                        {new Date(payment.date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                    </div>

                    <div className="wd-actions">

                      <button
                        className="wd-edit"
                        onClick={() => {
                          setEditingIndex(index);
                          setEditAmount(payment.amount);
                          setEditReason(payment.reason);
                        }}
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="wd-delete"
                        onClick={() =>
                          handleDeletePayment(payment._id)
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </>

                )}

              </div>
                          ))

          )}

        </div>

      </main>

    </div>

  );

}

export default WorkerDetails;
