import { useEffect, useState } from "react";
import { getAttendance } from "../services/api";

function Reports() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAttendance().then(setRecords);
  }, []);

  // ---------- GROUP BY DATE ----------
  const groupedByDate = records.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  // ---------- TOTAL WAGE PER WORKER ----------
  const workerTotals = records.reduce((acc, r) => {
    const name = r.workerId.name;
    acc[name] = (acc[name] || 0) + r.wage;
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <h1>Attendance Reports</h1>

      {/* ================= DATE-WISE REPORT ================= */}
      <h2 style={{ marginTop: "20px" }}>📅 Date-wise Attendance</h2>

      {Object.keys(groupedByDate).length === 0 ? (
        <p>No attendance records found</p>
      ) : (
        Object.keys(groupedByDate)
          .sort()
          .map((date) => {
            const dayTotal = groupedByDate[date].reduce(
              (sum, r) => sum + r.wage,
              0
            );

            return (
              <div
                key={date}
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              >
                <h3>{date}</h3>

                <table
                  width="100%"
                  border="1"
                  cellPadding="8"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr>
                      <th>Worker</th>
                      <th>Status</th>
                      <th>Wage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByDate[date].map((r) => (
                      <tr key={r._id}>
                        <td>{r.workerId.name}</td>
                        <td>{r.status}</td>
                        <td>₹{r.wage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p style={{ marginTop: "8px", fontWeight: "bold" }}>
                  Total wage for {date}: ₹{dayTotal}
                </p>
              </div>
            );
          })
      )}

      {/* ================= WORKER-WISE TOTAL ================= */}
      <h2 style={{ marginTop: "30px" }}>👤 Worker-wise Total Wages</h2>

      {Object.keys(workerTotals).length === 0 ? (
        <p>No wage data available</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Worker Name</th>
              <th>Total Wage (All Days)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(workerTotals).map((name) => (
              <tr key={name}>
                <td>{name}</td>
                <td>₹{workerTotals[name]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Reports;
