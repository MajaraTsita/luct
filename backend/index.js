require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize, User } = require("./models");

// Import routes
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");
const userRoutes = require("./routes/users");
const ratingRoutes = require("./routes/ratings");
const monitoringRoutes = require("./routes/monitoring");
const attendanceRoutes = require("./routes/attendance");
const classesRoutes = require("./routes/classes");
const coursesRoutes = require("./routes/courses");

const app = express();

// ✅ Improved CORS configuration
app.use(cors({
  origin: "http://localhost:3000", // Your React app URL
  credentials: true
}));
app.use(bodyParser.json());

// ✅ Add request logging to debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/courses", coursesRoutes);

// ✅ Add a simple test route to check if API is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// ✅ Add a health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: "Connected" 
  });
});

// ✅ Handle 404 for undefined routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ 
    error: `Route not found: ${req.method} ${req.originalUrl}` 
  });
});

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    const reset = process.env.DB_RESET === "true";
    await sequelize.sync(reset ? { force: true } : { alter: true });

    console.log(
      reset
        ? "⚠️ Database reset with force: true (all tables dropped and recreated)"
        : "✅ Database synced with alter: true (schema updated safely)"
    );

    // Create default admin if not exists
    const admin = await User.findOne({ where: { email: "admin@luct.edu" } });
    if (!admin) {
      await User.create({
        name: "Admin",
        surname: "User",
        email: "admin@luct.edu",
        password: "password",
        role: "PL", // ✅ Changed from LECTURER to PL for course management
      });
      console.log("✅ Created default admin user: admin@luct.edu / password");
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

start();