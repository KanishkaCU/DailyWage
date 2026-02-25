const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day"],
      required: true,
    },

    wage: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate attendance per user + worker + date
attendanceSchema.index(
  { userId: 1, workerId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);

//64oilp3Su4Nx2Q2h