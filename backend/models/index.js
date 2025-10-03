require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// ✅ Connect to MySQL (XAMPP)
const sequelize = new Sequelize(
  process.env.DB_NAME || "luct_reporting",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "127.0.0.1", // ⚡ safer than localhost
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  }
);

// ✅ Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL:", process.env.DB_NAME);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

// ✅ Import models
const User = require("./user")(sequelize, DataTypes);
const Report = require("./report")(sequelize, DataTypes);
const Attendance = require("./attendance")(sequelize, DataTypes);
const Rating = require("./rating")(sequelize, DataTypes);
const Monitoring = require("./monitoring")(sequelize, DataTypes);
const Class = require("./Classes")(sequelize, DataTypes);
const Course = require("./course")(sequelize, DataTypes);   // 👈 FIX: register Course

// ✅ Relationships

// User → Report
User.hasMany(Report, { as: "reports", foreignKey: "userId" });
Report.belongsTo(User, { as: "reporter", foreignKey: "userId" });

// User → Rating
User.hasMany(Rating, { as: "ratings", foreignKey: "userId" });
Rating.belongsTo(User, { as: "user", foreignKey: "userId" });

// User → Attendance
User.hasMany(Attendance, { as: "attendances", foreignKey: "userId" });
Attendance.belongsTo(User, { as: "student", foreignKey: "userId" });

// Course → Class
Course.hasMany(Class, { as: "classes", foreignKey: "courseId" });
Class.belongsTo(Course, { as: "course", foreignKey: "courseId" });

// Course → Report (optional, if reports belong to a course)
Course.hasMany(Report, { as: "reports", foreignKey: "courseId" });
Report.belongsTo(Course, { as: "course", foreignKey: "courseId" });

// Course → User (creator/owner)
Course.belongsTo(User, { as: "createdBy", foreignKey: "createdById" });
User.hasMany(Course, { as: "createdCourses", foreignKey: "createdById" });

// ✅ Export everything
module.exports = {
  sequelize,
  User,
  Report,
  Attendance,
  Rating,
  Monitoring,
  Class,
  Course,  // 👈 FIX: export Course
};
