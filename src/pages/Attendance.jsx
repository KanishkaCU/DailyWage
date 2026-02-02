import { useEffect, useState } from "react";
import { getWorkers, markAttendance } from "../services/api";

function Attendance() {
  const [workers, setWorkers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchWorkers = async () => {
      const data = await getWorkers();
      setWorkers(data);
    };

    fetchWorkers();
  }, []);

  const handleStatusChange = (workerId, status) => {
    setAttendanceData({
      ...attendanceData,
      [workerId]: { status, wage: "" },
    });
  };

  const handleWageChange = (workerId, wage) => {
    setAttendanceData({
      ...attendanceData,
      [workerId]: {
        ...attendanceData[workerId],
        wage,
      },
    });
  };

  const saveAttendance = async (workerId) => {
    const data = attendanceData[workerId];
    if (!data) return;

    if (data.status === "Present" && !data.wage) {
      setMessage("Please enter wage before saving ❌");
      return;
    }

    await markAttendance({
      workerId,
      date: today,
      status: data.status,
      wage: data.status === "Present" ? Number(data.wage) : 0,
    });

    setMessage("Attendance saved successfully ✅");

    // auto-clear message after 2 seconds
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Attendance</h1>
      <p>Date: {today}</p>

      {message && (
        <p style={{ color: "green", marginBottom: "15px" }}>{message}</p>
      )}

      {workers.length === 0 ? (
        <p>No workers found</p>
      ) : (
        workers.map((worker) => (
          <div
            key={worker._id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <strong>{worker.name}</strong>

            <div style={{ marginTop: "8px" }}>
              <button
                onClick={() => handleStatusChange(worker._id, "Present")}
              >
                Present
              </button>{" "}
              <button
                onClick={() => handleStatusChange(worker._id, "Absent")}
              >
                Absent
              </button>
            </div>

            {attendanceData[worker._id]?.status === "Present" && (
              <div style={{ marginTop: "8px" }}>
                <input
                  type="number"
                  placeholder="Enter wage"
                  value={attendanceData[worker._id].wage}
                  onChange={(e) =>
                    handleWageChange(worker._id, e.target.value)
                  }
                />
              </div>
            )}

            {attendanceData[worker._id] && (
              <div style={{ marginTop: "8px" }}>
                <button onClick={() => saveAttendance(worker._id)}>
                  Save Attendance
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Attendance;
