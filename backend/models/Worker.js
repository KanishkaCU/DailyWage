const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  dailyWage: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
  },
});

module.exports = mongoose.model("Worker", workerSchema);
