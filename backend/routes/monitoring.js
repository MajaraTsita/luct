const express = require("express");
const { Monitoring } = require("../models");

const router = express.Router();

// Get all monitoring records
router.get("/", async (req, res) => {
  try {
    const records = await Monitoring.findAll();
    res.json(records);
  } catch (err) {
    console.error("Monitoring fetch error:", err);
    res.status(500).json({ error: "Failed to fetch monitoring records" });
  }
});

// Add new monitoring record
router.post("/", async (req, res) => {
  try {
    const { courseName, lecturerName, totalRegisteredStudents, actualStudentsPresent } = req.body;

    const record = await Monitoring.create({
      courseName,
      lecturerName,
      totalRegisteredStudents,
      actualStudentsPresent,
    });

    res.status(201).json(record);
  } catch (err) {
    console.error("Monitoring save error:", err);
    res.status(500).json({ error: "Failed to save monitoring record" });
  }
});

module.exports = router;
