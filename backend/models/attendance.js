const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "worker",
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
  wage: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("attendance", attendanceSchema);
