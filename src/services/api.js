const BASE_URL = "http://localhost:5000/api";

/* ===== WORKERS ===== */
export const getWorkers = async () => {
  const res = await fetch(`${BASE_URL}/workers`);
  return res.json();
};

/* ===== ATTENDANCE ===== */
export const markAttendance = async (data) => {
  const res = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return res.json();
};

export const getAttendance = async (date) => {
  const url = date
    ? `${BASE_URL}/attendance?date=${date}`
    : `${BASE_URL}/attendance`;

  const res = await fetch(url);
  return res.json();
};

export const getWorkerAttendance = async (id) => {
  const res = await fetch(`${BASE_URL}/attendance/${id}`);
  return res.json();
};
