const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
  },
  date: String,
  status: String,
  wage: Number,
});

attendanceSchema.index({ workerId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

//64oilp3Su4Nx2Q2h