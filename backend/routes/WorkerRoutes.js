const express = require("express");
const Worker = require("../models/Worker");

const router = express.Router();

// add worker
router.post("/", async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ message: "Error adding worker" });
  }
});

// get all workers
router.get("/", async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workers" });
  }
});

module.exports = router;
