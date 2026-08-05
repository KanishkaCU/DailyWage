const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://dailywage-1.onrender.com/api");

/* ================= AUTH ================= */

export const loginUser = async ({ username, password }) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Login failed");
  return result;
};

export const signupUser = async ({ username, email, password }) => {
  const res = await fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Signup failed");
  return result;
};

/* ================= WORKERS ================= */

export const getWorkers = async (overrideUserId) => {
  const userId = overrideUserId || localStorage.getItem("userId");
  if (!userId) return [];

  const res = await fetch(`${BASE_URL}/workers?userId=${userId}`);

  if (!res.ok) throw new Error("Failed to fetch workers");
  return res.json();
};

export const addWorker = async ({ name, phone, userId: passedUserId }) => {
  const userId = passedUserId || localStorage.getItem("userId");

  const res = await fetch(`${BASE_URL}/workers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, userId }),
  });

  if (!res.ok) throw new Error("Failed to add worker");
  return res.json();
};

export const deleteWorker = async (workerId) => {
  const res = await fetch(`${BASE_URL}/workers/${workerId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete worker");
  return res.json();
};

/* ================= ATTENDANCE ================= */

export const markAttendance = async ({
  workerId,
  date,
  status,
  wage,
}) => {
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      workerId,
      date,
      status,
      wage,
      userId,
    }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Attendance failed");
  return result;
};

export const getAttendance = async (params) => {
  const userId = localStorage.getItem("userId");
  let url = `${BASE_URL}/attendance?userId=${userId}`;

  if (typeof params === "string") {
    url += `&date=${params}`;
  } else if (typeof params === "object" && params !== null) {
    if (params.date) url += `&date=${params.date}`;
    if (params.startDate) url += `&startDate=${params.startDate}`;
    if (params.endDate) url += `&endDate=${params.endDate}`;
    if (params.workerId) url += `&workerId=${params.workerId}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
};

export const getWorkerAttendance = async (workerId) => {
  const userId = localStorage.getItem("userId");
  const res = await fetch(`${BASE_URL}/attendance/worker/${workerId}?userId=${userId}`);

  if (!res.ok) throw new Error("Failed to fetch worker attendance");
  return res.json();
};

/* ================= PAYMENTS ================= */

export const addPayment = async (workerId, data) => {
  const res = await fetch(`${BASE_URL}/workers/${workerId}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add payment");
  return res.json();
};

export const editPayment = async (workerId, paymentId, data) => {
  const res = await fetch(
    `${BASE_URL}/workers/${workerId}/pay/${paymentId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Failed to edit payment");
  return res.json();
};

export const deletePayment = async (workerId, paymentId) => {
  const res = await fetch(
    `${BASE_URL}/workers/${workerId}/pay/${paymentId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) throw new Error("Failed to delete payment");
  return res.json();
};

