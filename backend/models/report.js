// backend/models/report.js
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "Report",
    {
      facultyName: { type: DataTypes.STRING, allowNull: false },
      className: { type: DataTypes.STRING, allowNull: false },
      weekOfReporting: { type: DataTypes.STRING },
      dateOfLecture: { type: DataTypes.STRING },
      courseName: { type: DataTypes.STRING },
      courseCode: { type: DataTypes.STRING },
      lecturerName: { type: DataTypes.STRING },
      actualStudentsPresent: { type: DataTypes.INTEGER },
      totalRegisteredStudents: { type: DataTypes.INTEGER },
      venue: { type: DataTypes.STRING },
      scheduledTime: { type: DataTypes.STRING },
      topicTaught: { type: DataTypes.TEXT },
      learningOutcomes: { type: DataTypes.TEXT },
      recommendations: { type: DataTypes.TEXT },

      // ✅ Workflow fields
      status: {
        type: DataTypes.ENUM("SUBMITTED", "REVIEWED", "FORWARDED"),
        defaultValue: "SUBMITTED", // when lecturer first submits
      },

      // ✅ Principal Lecturer review
      prlComments: { type: DataTypes.TEXT, allowNull: true },
      prlId: { type: DataTypes.INTEGER, allowNull: true },
      prlReviewedAt: { type: DataTypes.DATE, allowNull: true },

      // ✅ Program Leader finalization
      plId: { type: DataTypes.INTEGER, allowNull: true },
      plFinalizedAt: { type: DataTypes.DATE, allowNull: true },

      // ✅ Who submitted the report
      submittedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "Reports",
      timestamps: true, // adds createdAt + updatedAt
    }
  );

  return Report;
};
