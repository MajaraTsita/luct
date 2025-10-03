// backend/models/monitoring.js
module.exports = (sequelize, DataTypes) => {
  const Monitoring = sequelize.define("Monitoring", {
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lecturerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalRegisteredStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actualStudentsPresent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Monitoring;
};
