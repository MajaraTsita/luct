const express = require("express");
const { Rating } = require("../models");
const auth = require("./auth"); // ✅ import verifyToken middleware

const router = express.Router();

// ====================
// Get my ratings
// ====================
router.get("/my", auth.verifyToken, async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { userId: req.user.id }, // ✅ comes from middleware
      order: [["createdAt", "DESC"]],
    });

    res.json(ratings);
  } catch (err) {
    console.error("❌ Ratings fetch error:", err);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

// ====================
// Add a new rating
// ====================
router.post("/", auth.verifyToken, async (req, res) => {
  try {
    const { lectureName, lecturePerformance, studentBehavior, comments } = req.body;

    const rating = await Rating.create({
      lectureName,
      lecturePerformance,
      studentBehavior,
      comments,
      userId: req.user.id, // ✅ always safe from middleware
    });

    res.status(201).json(rating);
  } catch (err) {
    console.error("❌ Rating save error:", err);
    res.status(500).json({ error: "Failed to save rating" });
  }
});

module.exports = router;
