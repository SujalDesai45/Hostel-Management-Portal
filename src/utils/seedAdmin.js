const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function ensureAdminUser() {
  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    console.log("Admin already exists");
    return;
  }
  const hashed = await bcrypt.hash("admin123", 10);
  await User.create({
    fullName: "Administrator",
    username: "admin",
    email: "admin@hostel.com",
    password: hashed,
    role: "admin"
  });
  console.log("✔ Default Admin Created | username: admin | password: admin123");
}

module.exports = { ensureAdminUser };
