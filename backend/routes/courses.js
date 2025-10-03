const express = require("express");
const { Class } = require("../models");
const { verifyToken } = require("./auth"); // ✅ Add authentication

const router = express.Router();

// ✅ Get ALL classes (for dashboard - fixed route)
router.get("/", verifyToken, async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json(classes || []);
  } catch (err) {
    console.error("❌ Fetch classes error:", err.message);
    res.json([]); // ✅ Return empty array instead of error for dashboard
  }
});

// ✅ Get classes for a specific lecturer
router.get("/lecturer/:lecturerId", verifyToken, async (req, res) => {
  try {
    const classes = await Class.findAll({
      where: { lecturerId: req.params.lecturerId },
    });
    res.json(classes);
  } catch (err) {
    console.error("❌ Fetch lecturer classes error:", err.message);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// ✅ Add new class
router.post("/", verifyToken, async (req, res) => {
  try {
    const { courseName, lecturerId, lecturerName, courseCode } = req.body;

    if (!courseName || !lecturerId || !lecturerName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newClass = await Class.create({
      courseName,
      lecturerId,
      lecturerName,
      courseCode,
    });

    res.status(201).json(newClass);
  } catch (err) {
    console.error("❌ Add class error:", err.message);
    res.status(500).json({ error: "Failed to create class" });
  }
});

// ✅ Delete class
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Class.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Class not found" });
    }
  } catch (err) {
    console.error("❌ Delete class error:", err.message);
    res.status(500).json({ error: "Failed to delete class" });
  }
});

module.exports = router;