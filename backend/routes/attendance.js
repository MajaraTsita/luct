// backend/routes/attendance.js
const express = require("express");
const { Attendance } = require("../models"); // ✅ import Sequelize model
const router = express.Router();

// Get all attendance records (from DB)
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.findAll(); // ✅ fetch from DB
    res.json(records);
  } catch (err) {
    console.error("Attendance fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// Add new attendance record (save to DB)
router.post("/", async (req, res) => {
  try {
    const { name, surname, studentNumber, phone, signIn, signOut } = req.body;

    // ✅ save directly into MySQL
    const record = await Attendance.create({
      name,
      surname,
      studentNumber,
      phone,
      signIn,
      signOut,
    });

    console.log("📝 Attendance Recorded:", record.toJSON());

    res.status(201).json({
      message: "Attendance recorded successfully ✅ (saved to DB)",
      record,
    });
  } catch (err) {
    console.error("Attendance save error:", err.message);
    res.status(500).json({ error: "Failed to record attendance" });
  }
});

module.exports = router;
