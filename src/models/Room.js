const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["2-sharing", "3-sharing"], required: true },
    numRooms: { type: Number, required: true },
    capacityPerRoom: { type: Number, required: true },
    totalBeds: { type: Number, required: true },
    availableBeds: { type: Number, required: true },
    pricePerMonth: { type: Number, required: true },
    photoUrl: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
