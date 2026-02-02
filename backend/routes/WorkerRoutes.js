const express = require("express");
const Worker = require("../models/worker");

const router = express.Router();

// ADD WORKER
router.post("/", async (req, res) => {
  try {
    const { name, phone } = req.body;

    const worker = new Worker({ name, phone });
    await worker.save();

    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to add worker" });
  }
});

// GET ALL WORKERS
router.get("/", async (req, res) => {
  const workers = await Worker.find();
  res.json(workers);
});
// UPDATE PAID AMOUNT
router.put("/:id/pay", async (req, res) => {
  try {
    const { paidAmount } = req.body;

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { paidAmount },
      { new: true }
    );

    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment" });
  }
});
// ADD PAYMENT (do not overwrite, push)
router.post("/:id/pay", async (req, res) => {
  try {
    const { amount, date } = req.body;

    const worker = await Worker.findById(req.params.id);
    worker.payments.push({ amount, date });

    await worker.save();
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to add payment" });
  }
});

module.exports = router;
