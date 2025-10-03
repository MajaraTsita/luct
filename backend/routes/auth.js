// backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const router = express.Router();

// =====================
// REGISTER
// =====================
router.post("/register", async (req, res) => {
  try {
    const { name, surname, email, password, role, studentNumber } = req.body;

    // ✅ validate student number for students
    if (role === "STUDENT" && !/^\d{9}$/.test(studentNumber || "")) {
      return res
        .status(400)
        .json({ error: "Student number must be exactly 9 digits" });
    }

    // ✅ create new user (password hashing is handled in model hook)
    const user = await User.create({
      name,
      surname,
      email,
      password,
      role,
      studentNumber: role === "STUDENT" ? studentNumber : null,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// =====================
// LOGIN
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ check password
    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        studentNumber: user.studentNumber,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// =====================
// MIDDLEWARE
// =====================

// ✅ verify token middleware
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    // ✅ Expecting "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ✅ restrict route by role
function requireRole(roles) {
  return (req, res, next) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}

// attach middlewares so they can be reused
router.verifyToken = verifyToken;
router.requireRole = requireRole;

module.exports = router;
