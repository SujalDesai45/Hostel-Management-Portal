const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    bedCount: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid", "completed"],
      default: "pending"
    },
    durationMonths: { type: Number },
    totalAmount: { type: Number },
    paymentMethod: { type: String, enum: ["upi", "card", "cash", null], default: null },
    paymentDate: { type: Date },
    endDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
