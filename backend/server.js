require("dotenv").config();   // 👈 ADD THIS AT TOP

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const workerRoutes = require("./routes/WorkerRoutes");
const userRoutes = require("./routes/userRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

app.use("/api/workers", workerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

// 🔥 CONNECT TO ATLAS INSTEAD OF LOCAL
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected to Atlas"))
  .catch((err) => console.log(err));
  console.log(process.env.MONGO_URI);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
