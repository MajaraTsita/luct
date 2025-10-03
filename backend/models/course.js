// backend/models/Class.js
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("Class", {
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lecturerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lecturerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: true, // optional
    },
  });

  return Class;
};
