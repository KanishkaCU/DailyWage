const BASE_URL = "http://localhost:5000/api";

/* ======================
   AUTH
====================== */

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json();
};

export const signupUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Signup failed");
  }

  return res.json();
};

/* ======================
   WORKERS
====================== */

export const getWorkers = async () => {
  const res = await fetch(`${BASE_URL}/workers`);
  return res.json();
};

export const addWorker = async (data) => {
  const res = await fetch(`${BASE_URL}/workers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* ======================
   ATTENDANCE
====================== */

export const markAttendance = async (data) => {
  const res = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Attendance failed");
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

/* ======================
   PAYMENTS
====================== */

export const addPayment = async (id, data) => {
  const res = await fetch(`${BASE_URL}/workers/${id}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const editPayment = async (workerId, index, data) => {
  const res = await fetch(
    `${BASE_URL}/workers/${workerId}/pay/${index}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return res.json();
};

export const deletePayment = async (workerId, index) => {
  const res = await fetch(
    `${BASE_URL}/workers/${workerId}/pay/${index}`,
    { method: "DELETE" }
  );
  return res.json();
};
