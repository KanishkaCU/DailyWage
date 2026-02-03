const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  payments: [
    {
      amount: Number,
      date: String,
      purpose: String,
    },
  ],
});

module.exports = mongoose.model("Worker", workerSchema);
