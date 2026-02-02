import "../styles/dashboard.css";

function Attendance() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Mark Attendance</h1>
        <p>Attendance for today</p>
      </div>

      {/* Attendance Card */}
      <div className="dashboard-card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <th>Worker Name</th>
              <th>Role</th>
              <th>Present</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                No workers available. Please add workers first.
              </td>
            </tr>
          </tbody>
        </table>

        <br />
        <button disabled>Submit Attendance</button>
      </div>
    </div>
  );
}

export default Attendance;
