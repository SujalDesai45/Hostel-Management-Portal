const express = require("express");
const Room = require("../models/Room");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: list rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// Admin: create room
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, type, numRooms, capacityPerRoom, pricePerMonth, photoUrl } = req.body;
    const totalBeds = Number(numRooms) * Number(capacityPerRoom);
    const room = await Room.create({
      name,
      type,
      numRooms,
      capacityPerRoom,
      totalBeds,
      availableBeds: totalBeds,
      pricePerMonth,
      photoUrl
    });
    res.json(room);
  } catch (err) {
    console.error("Room create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: delete room
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: "Room deleted" });
});

module.exports = router;
