const express = require("express");
const Attendance = require("../models/attendance");

const router = express.Router();

// Helper to normalize date to start of day
const getStartOfDay = (dateString) => {
  const d = dateString ? new Date(dateString) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfDay = (dateString) => {
  const d = dateString ? new Date(dateString) : new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

/* POST / MARK OR UPDATE ATTENDANCE (UPSERT) */
router.post("/", async (req, res) => {
  try {
    const { userId, workerId, date, status, wage } = req.body;

    if (!userId || !workerId || !date || !status) {
      return res.status(400).json({ message: "userId, workerId, date, and status are required" });
    }

    const startOfDay = getStartOfDay(date);
    const endOfDay = getEndOfDay(date);

    // Look for existing attendance record for this worker on this date
    let attendance = await Attendance.findOne({
      userId,
      workerId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (attendance) {
      attendance.status = status;
      attendance.wage = status === "Present" || status === "Half Day" ? Number(wage || 0) : 0;
      await attendance.save();
    } else {
      attendance = new Attendance({
        userId,
        workerId,
        date: startOfDay,
        status,
        wage: status === "Present" || status === "Half Day" ? Number(wage || 0) : 0,
      });
      await attendance.save();
    }

    const populated = await Attendance.findById(attendance._id).populate("workerId", "name phone");
    res.status(200).json(populated);
  } catch (err) {
    console.error("Attendance Save Error:", err);
    res.status(500).json({ message: "Failed to save attendance" });
  }
});

/* GET / ATTENDANCE (WITH FILTERS: userId, date, startDate, endDate, workerId) */
router.get("/", async (req, res) => {
  try {
    const { userId, date, startDate, endDate, workerId } = req.query;

    const query = {};
    if (userId) query.userId = userId;
    if (workerId) query.workerId = workerId;

    if (date) {
      query.date = {
        $gte: getStartOfDay(date),
        $lte: getEndOfDay(date),
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: getStartOfDay(startDate),
        $lte: getEndOfDay(endDate),
      };
    }

    const records = await Attendance.find(query)
      .populate("workerId", "name phone")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.error("Attendance Fetch Error:", error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
});

/* GET ATTENDANCE FOR A SPECIFIC WORKER */
router.get("/worker/:workerId", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = { workerId: req.params.workerId };
    if (userId) query.userId = userId;

    const records = await Attendance.find(query).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching worker attendance history" });
  }
});

// Fallback for legacy GET /:workerId route if not 'worker'
router.get("/:workerId", async (req, res) => {
  try {
    const { userId } = req.query;
    const query = { workerId: req.params.workerId };
    if (userId) query.userId = userId;

    const records = await Attendance.find(query).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching worker attendance" });
  }
});

module.exports = router;
