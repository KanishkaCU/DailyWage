const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

/* ======================
   POST ATTENDANCE
====================== */
router.post("/", async (req, res) => {
  try {
    const { workerId, date, status, wage } = req.body;

    if (!workerId || !date || !status) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const alreadyMarked = await Attendance.findOne({ workerId, date });
    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: "Attendance already marked" });
    }

    const record = new Attendance({
      workerId,
      date,
      status,
      wage: status === "Present" ? wage : 0,
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
});

/* ======================
   GET ALL ATTENDANCE
====================== */
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

/* ======================
   GET ATTENDANCE BY WORKER
====================== */
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
