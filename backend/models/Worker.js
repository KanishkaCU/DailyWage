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
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("worker", workerSchema);
