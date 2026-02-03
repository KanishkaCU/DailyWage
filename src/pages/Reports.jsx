import { useEffect, useState } from "react";
import { getAttendance } from "../services/api";

function Reports() {
  const today = new Date().toISOString().split("T")[0];

  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    getAttendance().then(setRecords);
  }, []);

  // Filter by selected date
  const filteredRecords = records.filter(
    (r) => r.date === selectedDate
  );

  const totalWage = filteredRecords.reduce(
    (sum, r) => sum + r.wage,
    0
  );


  return (
    <div style={{ padding: "20px" }}>

      <h1>Reports</h1>

      {/* Date Picker */}
      <div style={{ margin: "15px 0" }}>
        <label style={{ marginRight: "10px" }}>
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Table */}
      {filteredRecords.length === 0 ? (
        <p>No attendance found for this date</p>
      ) : (
        <>
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr>
                <th>Worker</th>
                <th>Status</th>
                <th>Wage</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r._id}>
                  <td>{r.workerId.name}</td>
                  <td>{r.status}</td>
                  <td>₹{r.wage}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            Total wage for {selectedDate}: ₹{totalWage}
          </p>
        </>
      )}
      {/* BACK BUTTON – ONLY ADDITION */}
      <button
        onClick={() => window.history.back()}
        style={{
          marginBottom: "10px",
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>
    </div>
  );
}

export default Reports;
