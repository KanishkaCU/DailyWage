const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// SAVE ATTENDANCE
router.post("/", async (req, res) => {
  try {
    console.log("ATTENDANCE BODY:", req.body); // 👈 DEBUG LINE

    const { workerId, date, status, wage } = req.body;

    if (!workerId || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ❗ TEMPORARILY DISABLE DUPLICATE CHECK (VERY IMPORTANT)
    // This is the MOST COMMON reason attendance "does not save"
    /*
    const existing = await Attendance.findOne({ workerId, date });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked" });
    }
    */

    const attendance = new Attendance({
      workerId,
      date,
      status,
      wage: status === "Present" ? Number(wage || 0) : 0,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    console.error("ATTENDANCE ERROR:", err);
    res.status(500).json({ message: "Failed to save attendance" });
  }
});

// GET ATTENDANCE (REPORTS)
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const filter = date ? { date } : {};
    const records = await Attendance.find(filter).populate("workerId");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

// GET ATTENDANCE BY WORKER
router.get("/:workerId", async (req, res) => {
  try {
    const records = await Attendance.find({
      workerId: req.params.workerId,
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch worker attendance" });
  }
});

module.exports = router;
