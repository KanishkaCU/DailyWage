import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkers } from "../services/api";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Dashboard() {
  const [workers, setWorkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getWorkers().then(setWorkers);
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="main">
        {/* Top Bar */}
        <div className="topbar">
          <div>
            <h1>Dashboard</h1>
            <span>{today}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="cards">
          <div className="card">
            <h3>{workers.length}</h3>
            <p>Total Workers</p>
          </div>

          <div className="card" onClick={() => navigate("/attendance")}>
            <h3>📋</h3>
            <p>Attendance</p>
          </div>

          <div className="card" onClick={() => navigate("/reports")}>
            <h3>₹</h3>
            <p>Payments</p>
          </div>

          <div className="card" onClick={() => navigate("/reports")}>
            <h3>📊</h3>
            <p>Reports</p>
          </div>
        </div>

        {/* Worker Table */}
        <div className="table-card">
          <h3>Workers</h3>

          {workers.length === 0 ? (
            <p>No workers found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w._id}>
                    <td>{w.name}</td>
                    <td>{w.phone}</td>
                    <td>
                      <button onClick={() => navigate(`/worker/${w._id}`)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;