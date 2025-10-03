// backend/routes/reports.js
const express = require("express");
const { Report, User } = require("../models");
const { verifyToken, requireRole } = require("../routes/auth");
const ExcelJS = require("exceljs"); // 👈 added for Excel export

const router = express.Router();

// ================== PUBLIC ROUTES ==================

// Get all reports (with optional search by facultyName/className/courseName)
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    let where = {};

    if (q) {
      where = {
        [require("sequelize").Op.or]: [
          { facultyName: { [require("sequelize").Op.like]: `%${q}%` } },
          { className: { [require("sequelize").Op.like]: `%${q}%` } },
          { courseName: { [require("sequelize").Op.like]: `%${q}%` } },
        ],
      };
    }

    const reports = await Report.findAll({
      where,
      include: [{ model: User, as: "reporter" }],
    });
    res.json(reports);
  } catch (err) {
    console.error("Reports fetch error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Export reports to Excel
router.get("/export/xlsx", async (req, res) => {
  try {
    const { facultyName } = req.query;
    const where = {};

    if (facultyName) {
      where.facultyName = facultyName;
    }

    const reports = await Report.findAll({ where });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reports");

    sheet.columns = [
      { header: "Faculty", key: "facultyName", width: 20 },
      { header: "Class", key: "className", width: 20 },
      { header: "Course", key: "courseName", width: 20 },
      { header: "Code", key: "courseCode", width: 15 },
      { header: "Lecturer", key: "lecturerName", width: 20 },
      { header: "Present", key: "actualStudentsPresent", width: 10 },
      { header: "Registered", key: "totalRegisteredStudents", width: 12 },
      { header: "Date", key: "dateOfLecture", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "PRL Comments", key: "prlComments", width: 30 },
    ];

    reports.forEach((r) => sheet.addRow(r.toJSON()));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=reports.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ error: "Failed to export reports" });
  }
});

// ================== SECURED ROUTES ==================

// Lecturer submits a report (no auth version)
router.post("/", async (req, res) => {
  try {
    const {
      facultyName,
      className,
      courseCode,
      courseName,
      lecturerName,
      dateOfLecture,
      totalRegisteredStudents,
      actualStudentsPresent,
      topicTaught,
      learningOutcomes,
      recommendations,
      userId,
    } = req.body;

    const report = await Report.create({
      facultyName,
      className,
      courseCode,
      courseName,
      lecturerName,
      dateOfLecture,
      totalRegisteredStudents,
      actualStudentsPresent,
      topicTaught,
      learningOutcomes,
      recommendations,
      submittedBy: userId,
      status: "SUBMITTED",
    });

    res.status(201).json({
      message: "✅ Report submitted successfully to PRL",
      report,
    });
  } catch (err) {
    console.error("Report save error:", err);
    res.status(500).json({ error: "Failed to save report" });
  }
});

// Lecturer creates report (authenticated)
router.post("/secure", verifyToken, requireRole("LECTURER"), async (req, res) => {
  try {
    const submittedBy = req.user?.id || null;
    const payload = { ...req.body, status: "SUBMITTED", submittedBy };
    const report = await Report.create(payload);

    res.status(201).json({
      message: "✅ Report submitted successfully to PRL",
      report,
    });
  } catch (err) {
    console.error("Create report error:", err.message);
    res.status(500).json({ error: "Failed to create report" });
  }
});

// Get single report
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

// PRL review → change to REVIEWED
router.put("/:id/review", verifyToken, requireRole("PRL"), async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (report.status !== "SUBMITTED") {
      return res.status(400).json({ error: "Report not in lecturer-submitted state" });
    }

    report.prlComments = req.body.prlComments || "";
    report.prlId = req.user.id;
    report.prlReviewedAt = new Date();
    report.status = "REVIEWED";
    await report.save();

    res.json(report);
  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({ error: "Failed to review report" });
  }
});

// PL finalize → change to FORWARDED
router.put("/:id/finalize", verifyToken, requireRole("PL"), async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (report.status !== "REVIEWED") {
      return res.status(400).json({ error: "Report not ready for finalize" });
    }

    report.status = "FORWARDED";
    report.plId = req.user.id;
    report.plFinalizedAt = new Date();
    await report.save();

    res.json(report);
  } catch (err) {
    console.error("Finalize error:", err.message);
    res.status(500).json({ error: "Failed to finalize report" });
  }
});

// ================== ROLE-BASED FETCH ==================
router.get("/secure/all", verifyToken, async (req, res) => {
  try {
    const role = req.user.role;
    let pendingWhere = {};
    let historyWhere = {};

    if (role === "LECTURER") {
      pendingWhere = { submittedBy: req.user.id };
      historyWhere = { submittedBy: req.user.id };
    } else if (role === "PRL") {
      pendingWhere = { status: "SUBMITTED" };
      historyWhere = { prlId: req.user.id, status: ["REVIEWED", "FORWARDED"] };
    } else if (role === "PL") {
      pendingWhere = { status: "REVIEWED" };
      historyWhere = { plId: req.user.id, status: "FORWARDED" };
    }

    if (req.query.status) {
      const reports = await Report.findAll({ where: { status: req.query.status } });
      return res.json({ reports });
    }

    const [pending, history] = await Promise.all([
      Report.findAll({ where: pendingWhere }),
      Report.findAll({ where: historyWhere }),
    ]);

    res.json({ pending, history });
  } catch (err) {
    console.error("Role-based fetch error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

module.exports = router;
