const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  phone: String,
  payments: [
    {
      amount: Number,
      reason: String,
      date: String,
    },
  ],
});

module.exports = mongoose.model("Worker", workerSchema);
