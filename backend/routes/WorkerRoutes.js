const express = require("express");
const Worker = require("../models/Worker");

const router = express.Router();

/* ADD WORKER */
router.post("/", async (req, res) => {
  try {
    const { name, phone, userId } = req.body;

    const worker = new Worker({ name, phone, userId });
    await worker.save();

    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ message: "Failed to add worker" });
  }
});

/* GET WORKERS (USER-SPECIFIC) */
router.get("/", async (req, res) => {
  const { userId } = req.query;
  const workers = await Worker.find({ userId });
  res.json(workers);
});

/* ADD PAYMENT */
router.post("/:id/pay", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    worker.payments.push(req.body);
    await worker.save();
    res.json(worker);
  } catch {
    res.status(500).json({ message: "Failed to add payment" });
  }
});

/* DELETE PAYMENT */
router.delete("/:id/pay/:paymentId", async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  worker.payments = worker.payments.filter(
    (p) => p._id.toString() !== req.params.paymentId
  );
  await worker.save();
  res.json(worker);
});

/* EDIT PAYMENT */
router.put("/:id/pay/:paymentId", async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  const payment = worker.payments.id(req.params.paymentId);
  Object.assign(payment, req.body);
  await worker.save();
  res.json(worker);
});

module.exports = router;
