import { useState } from "react";
import { addWorker } from "../services/api";
import "../styles/dashboard.css";

function AddWorker() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dailyWage, setDailyWage] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !role || !dailyWage) {
      setMessage("Please fill all required fields");
      return;
    }

    const workerData = {
      name,
      role,
      dailyWage: Number(dailyWage),
      phone,
    };

    try {
      await addWorker(workerData);
      setMessage("Worker added successfully ✅");

      // clear form
      setName("");
      setRole("");
      setDailyWage("");
      setPhone("");
    } catch (error) {
      setMessage("Error adding worker ❌");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Add Worker</h1>
        <p>Enter worker details</p>
      </div>

      <div className="dashboard-card" style={{ maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="Worker Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Role (Feeding / Cleaning / Maintenance) *"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <br /><br />

        <input
          type="number"
          placeholder="Daily Wage (₹) *"
          value={dailyWage}
          onChange={(e) => setDailyWage(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br /><br />

        <button onClick={handleSubmit}>Add Worker</button>

        {message && (
          <p style={{ marginTop: "15px", fontSize: "14px" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddWorker;
