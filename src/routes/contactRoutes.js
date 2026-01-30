const express = require("express");
const Contact = require("../models/Contact");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: send contact query
router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;
  const c = await Contact.create({ name, email, phone, message });
  res.json({ message: "Message received", contact: c });
});

// Admin: get all contacts
router.get("/", protect, adminOnly, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

module.exports = router;