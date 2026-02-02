const BASE_URL = "http://localhost:5000/api";

// =======================
// WORKER APIs (you already have these)
// =======================

// Add worker
export const addWorker = async (workerData) => {
  const response = await fetch(`${BASE_URL}/workers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workerData),
  });

  if (!response.ok) {
    throw new Error("Failed to add worker");
  }

  return response.json();
};

// Get all workers
export const getWorkers = async () => {
  const response = await fetch(`${BASE_URL}/workers`);
  return response.json();
};

// =======================
// USER AUTH APIs (ADD THIS)
// =======================

// Signup
export const signupUser = async (data) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
};

// Login
export const loginUser = async (data) => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json();
};
