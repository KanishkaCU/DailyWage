const express = require("express");
const Worker = require("../models/Worker");
const Attendance = require("../models/attendance");

const router = express.Router();

/* ADD WORKER */
router.post("/", async (req, res) => {
  try {
    const { name, phone, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: "Name and userId required" });
    }

    const worker = new Worker({ name, phone, userId });
    await worker.save();

    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to add worker" });
  }
});

/* GET WORKERS (USER-SPECIFIC) */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const workers = await Worker.find({ userId }).sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workers" });
  }
});

/* DELETE WORKER */
router.delete("/:id", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    await Attendance.deleteMany({ workerId: req.params.id });
    await Worker.findByIdAndDelete(req.params.id);

    res.json({ message: "Worker and associated attendance records deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete worker" });
  }
});

/* ADD PAYMENT */
router.post("/:id/pay", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.payments.push(req.body);
    await worker.save();

    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to add payment" });
  }
});

/* DELETE PAYMENT */
router.delete("/:id/pay/:paymentId", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.payments = worker.payments.filter(
      (p) => p._id.toString() !== req.params.paymentId
    );

    await worker.save();
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete payment" });
  }
});

/* EDIT PAYMENT */
router.put("/:id/pay/:paymentId", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const payment = worker.payments.id(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    Object.assign(payment, req.body);
    await worker.save();

    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment" });
  }
});

module.exports = router;