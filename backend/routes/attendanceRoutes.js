const express = require("express");
const Attendance = require("../models/attendance");

const router = express.Router();

// MARK ATTENDANCE
router.post("/", async (req, res) => {
  try {
    const { workerId, date, status, wage } = req.body;

    // one attendance per worker per day
    const existing = await Attendance.findOne({ workerId, date });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const attendance = new Attendance({
      workerId,
      date,
      status,
      wage: status === "Present" ? wage : 0,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark attendance" });
  }
});

// GET ALL ATTENDANCE (for reports)
router.get("/", async (req, res) => {
  const records = await Attendance.find().populate("workerId");
  res.json(records);
});

// UPDATE ATTENDANCE
router.put("/:id", async (req, res) => {
  try {
    const { status, wage } = req.body;

    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        status,
        wage: status === "Present" ? wage : 0,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update attendance" });
  }
});

module.exports = router;
