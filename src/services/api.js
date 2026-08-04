const BASE_URL = "https://dailywage-1.onrender.com";

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

export const getWorkers = async () => {
  const userId = localStorage.getItem("userId");
  const res = await fetch(`${BASE_URL}/workers?userId=${userId}`);

  if (!res.ok) throw new Error("Failed to fetch workers");
  return res.json();
};

export const addWorker = async ({ name, phone }) => {
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${BASE_URL}/workers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, userId }),
  });

  if (!res.ok) throw new Error("Failed to add worker");
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

export const getAttendance = async (date) => {
  const userId = localStorage.getItem("userId");

  const res = await fetch(
    `${BASE_URL}/attendance?date=${date}&userId=${userId}`
  );

  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
};

export const getWorkerAttendance = async (workerId) => {
  const res = await fetch(`${BASE_URL}/attendance/${workerId}`);

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
