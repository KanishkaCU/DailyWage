import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Poultry Farm Dashboard</h1>
        <p>
          {dateTime.toLocaleDateString()} |{" "}
          {dateTime.toLocaleTimeString()}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Workers</h3>
          <p>0</p>
        </div>

        <div className="dashboard-card">
          <h3>Present Today</h3>
          <p>0</p>
        </div>

        <div className="dashboard-card">
          <h3>Absent Today</h3>
          <p>0</p>
        </div>

        <div className="dashboard-card">
          <h3>Today’s Wage</h3>
          <p>₹0</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <button onClick={() => navigate("/add-worker")}>
          Add Worker
        </button>

        <button onClick={() => navigate("/attendance")}>
          Mark Attendance
        </button>

        <button onClick={() => navigate("/reports")}>
          Reports
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
