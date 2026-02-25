const express = require("express");
const Attendance = require("../models/attendance");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, workerId, date, status, wage } = req.body;

    const exists = await Attendance.findOne({ workerId, date });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Attendance already marked" });
    }

    const attendance = new Attendance({
      userId,
      workerId,
      date,
      status,
      wage,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch {
    res.status(500).json({ message: "Failed to save attendance" });
  }
});

router.get("/:workerId", async (req, res) => {
  const records = await Attendance.find({
    workerId: req.params.workerId,
  });
  res.json(records);
});
// GET ATTENDANCE BY DATE (USER-SPECIFIC)
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().populate("workerId", "name");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
});


module.exports = router;
