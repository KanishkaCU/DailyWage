import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getWorkers,
  getWorkerAttendance,
  addPayment,
} from "../services/api";

function WorkerDetails() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      const workers = await getWorkers();
      const current = workers.find((w) => w._id === id);
      setWorker(current);

      const attendance = await getWorkerAttendance(id);
      setRecords(attendance);
    };

    loadData();
  }, [id]);

  if (!worker) return <p>Loading...</p>;

  const daysWorked = records.filter((r) => r.status === "Present").length;
  const totalEarned = records.reduce((sum, r) => sum + r.wage, 0);

  const totalPaid = worker.payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const balance = totalEarned - totalPaid;

  const savePayment = async () => {
    if (!amount) return;

    const updated = await addPayment(id, {
      amount: Number(amount),
      date: today,
    });

    setWorker(updated);
    setAmount("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{worker.name}</h1>
      <p>Phone: {worker.phone}</p>

      <hr />

      <p>Days Worked: <strong>{daysWorked}</strong></p>
      <p>Total Earned: <strong>₹{totalEarned}</strong></p>
      <p>Total Paid: <strong>₹{totalPaid}</strong></p>
      <p>Balance: <strong>₹{balance}</strong></p>

      <hr />

      <h3>Add Payment</h3>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={savePayment} style={{ marginLeft: "10px" }}>
        Add
      </button>

      <h3 style={{ marginTop: "20px" }}>Payment History</h3>

      {worker.payments.length === 0 ? (
        <p>No payments yet</p>
      ) : (
        <ul>
          {worker.payments.map((p, index) => (
            <li key={index}>
              {p.date} – ₹{p.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WorkerDetails;
