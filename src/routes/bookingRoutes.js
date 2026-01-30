const express = require("express");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Student: apply booking
router.post("/apply", protect, async (req, res) => {
  try {
    if (req.user.role !== "student")
      return res.status(403).json({ message: "Students only" });

    const { roomId, bedCount = 1 } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.availableBeds < bedCount) {
      return res.status(400).json({ message: "Not enough beds available" });
    }

    const booking = await Booking.create({
      student: req.user._id,
      room: roomId,
      bedCount,
      status: "pending"
    });

    res.json(booking);
  } catch (err) {
    console.error("Apply booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Student: own bookings
router.get("/my", protect, async (req, res) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Students only" });
  const bookings = await Booking.find({ student: req.user._id }).populate("room");
  res.json(bookings);
});

// Admin: all bookings
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("student", "fullName email")
      .populate("room");
    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: approve booking (reduce beds)
router.patch("/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const room = await Room.findById(booking.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.availableBeds < booking.bedCount) {
      return res.status(400).json({ message: "Not enough beds to approve" });
    }

    room.availableBeds -= booking.bedCount;
    await room.save();

    booking.status = "approved";
    await booking.save();

    // Populate before sending response
    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "fullName email")
      .populate("room");

    res.json(populatedBooking);
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: reject booking
router.patch("/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    booking.status = "rejected";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "fullName email")
      .populate("room");

    res.json(populatedBooking);
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Student: pay for approved booking
router.patch("/:id/pay", protect, async (req, res) => {
  try {
    if (req.user.role !== "student")
      return res.status(403).json({ message: "Students only" });

    const { durationType, paymentMethod } = req.body;
    const map = { "1month": 1, "3month": 3, "6month": 6, "1year": 12 };
    const durationMonths = map[durationType];
    if (!durationMonths)
      return res.status(400).json({ message: "Invalid duration" });

    if (!["upi", "card", "cash"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    const room = await Room.findById(booking.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (booking.status !== "approved") {
      return res.status(400).json({ message: "Booking must be approved" });
    }

    const totalAmount = room.pricePerMonth * durationMonths * booking.bedCount;
    const now = new Date();
    const endDate = new Date(now.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);

    booking.status = "paid";
    booking.durationMonths = durationMonths;
    booking.totalAmount = totalAmount;
    booking.paymentMethod = paymentMethod;
    booking.paymentDate = now;
    booking.endDate = endDate;
    await booking.save();

    res.json({
      message: "Payment simulated successfully",
      booking
    });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: end booking and free beds
router.patch("/:id/end", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const room = await Room.findById(booking.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (!["paid", "approved"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking not active" });
    }

    room.availableBeds += booking.bedCount;
    await room.save();

    booking.status = "completed";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "fullName email")
      .populate("room");

    res.json({ message: "Booking ended, beds freed", booking: populatedBooking });
  } catch (err) {
    console.error("End booking error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;