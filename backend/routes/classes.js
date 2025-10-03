const express = require("express");
const { Class } = require("../models");
const { verifyToken } = require("./auth");

const router = express.Router();

// Middleware for PL/PRL roles
const requirePLorPRL = (req, res, next) => {
  if (req.user.role === "PL" || req.user.role === "PRL") return next();
  return res.status(403).json({ error: "Access denied. Only PL and PRL can perform this action." });
};

// Get all classes
router.get("/", verifyToken, async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (err) {
    console.error("Fetch classes error:", err);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// Create a new class
router.post("/", verifyToken, requirePLorPRL, async (req, res) => {
  try {
    let {
      class_name,
      course_name,
      lecturer_name,
      semester,
      schedule_day,
      schedule_time,
      room,
      max_students
    } = req.body;

    // Validate required fields
    if (!class_name || !course_name || !lecturer_name) {
      return res.status(400).json({ error: "Missing required fields: class_name, course_name, lecturer_name" });
    }

    // Ensure types & default values
    semester = semester || "Sem";
    schedule_day = schedule_day || "Monday";
    schedule_time = schedule_time?.length === 5 ? schedule_time + ":00" : schedule_time || "09:00:00";
    room = room || "";
    max_students = parseInt(max_students) || 30;

    const newClass = await Class.create({
      class_name,
      course_name,
      lecturer_name,
      semester,
      schedule_day,
      schedule_time,
      room,
      max_students
    });

    res.status(201).json(newClass);
  } catch (err) {
    console.error("Create class error:", err);
    res.status(500).json({ error: "Failed to create class: " + err.message });
  }
});

module.exports = router;
