const BASE_URL = "http://localhost:5000/api";

// ================= USERS =================
export const signupUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
};

// ================= WORKERS =================
export const addWorker = async (data) => {
  const res = await fetch(`${BASE_URL}/workers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getWorkers = async () => {
  const res = await fetch(`${BASE_URL}/workers`);
  return res.json();
};

// ================= ATTENDANCE =================
export const markAttendance = async (data) => {
  const res = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getAttendance = async () => {
  const res = await fetch(`${BASE_URL}/attendance`);
  return res.json();
};
export const updateAttendance = async (id, data) => {
  const res = await fetch(`http://localhost:5000/api/attendance/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
};
export const getWorkerAttendance = async (workerId) => {
  const res = await fetch(`http://localhost:5000/api/attendance`);
  const data = await res.json();
  return data.filter((r) => r.workerId._id === workerId);
};

export const updatePaidAmount = async (workerId, paidAmount) => {
  const res = await fetch(
    `http://localhost:5000/api/workers/${workerId}/pay`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paidAmount }),
    }
  );
  return res.json();
};
export const addPayment = async (workerId, data) => {
  const res = await fetch(
    `http://localhost:5000/api/workers/${workerId}/pay`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return res.json();
};
