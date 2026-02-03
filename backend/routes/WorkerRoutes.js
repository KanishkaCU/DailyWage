const express = require("express");
const Worker = require("../models/worker");

const router = express.Router();

// ADD WORKER
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const worker = new Worker({ name, phone, payments: [] });
    await worker.save();
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to add worker" });
  }
});

// GET ALL WORKERS
router.get("/", async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workers" });
  }
});

// ADD PAYMENT
router.post("/:id/pay", async (req, res) => {
  try {
    const { amount, date, purpose } = req.body;

    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    worker.payments.push({ amount, date, purpose });
    await worker.save();

    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to add payment" });
  }
});

// EDIT PAYMENT
router.put("/:workerId/pay/:paymentIndex", async (req, res) => {
  try {
    const { workerId, paymentIndex } = req.params;
    const { amount, purpose } = req.body;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    if (!worker.payments[paymentIndex]) {
      return res.status(404).json({ message: "Payment not found" });
    }

    worker.payments[paymentIndex].amount = amount;
    worker.payments[paymentIndex].purpose = purpose;

    await worker.save();
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to edit payment" });
  }
});

// DELETE PAYMENT ✅
router.delete("/:workerId/pay/:paymentIndex", async (req, res) => {
  try {
    const { workerId, paymentIndex } = req.params;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    if (!worker.payments[paymentIndex]) {
      return res.status(404).json({ message: "Payment not found" });
    }

    worker.payments.splice(paymentIndex, 1);
    await worker.save();

    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete payment" });
  }
});

module.exports = router;
