const express = require("express");
const Feedback = require("../models/Feedback");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Student: submit feedback
router.post("/", protect, async (req, res) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Students only" });
  const { rating, message } = req.body;
  const fb = await Feedback.create({
    student: req.user._id,
    rating,
    message
  });
  res.json(fb);
});

// Admin: view all
router.get("/", protect, adminOnly, async (req, res) => {
  const fbs = await Feedback.find().populate("student", "fullName email");
  res.json(fbs);
});

module.exports = router;
