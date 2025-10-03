// backend/routes/users.js
const express = require("express");
const { User } = require("../models");
const { verifyToken } = require("./auth");

const router = express.Router();

// Get all users
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json(users || []);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.json([]);
  }
});

module.exports = router;