require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const feedbackRoutes = require("./src/routes/feedbackRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const { ensureAdminUser } = require("./src/utils/seedAdmin");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hostel Management Backend Running"));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/contacts", contactRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected ✔");
    await ensureAdminUser();
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.log("DB Connection Error →", err));
