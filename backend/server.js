require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const workerRoutes = require("./routes/WorkerRoutes");
const userRoutes = require("./routes/userRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();

/* ===== Middlewares ===== */
app.use(cors());
app.use(express.json());

/* ===== Routes ===== */
app.use("/api/workers", workerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);

/* ===== Health Check ===== */
app.get("/", (req, res) => {
  res.status(200).send("✅ Backend running successfully");
});

/* ===== Server & DB ===== */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });