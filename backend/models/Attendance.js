// models/attendance.js
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING, allowNull: false },
      studentNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [9, 9], // exactly 9 characters
        },
      },
      phone: { type: DataTypes.STRING, allowNull: false },
      signIn: { type: DataTypes.STRING, allowNull: false }, // signature / initials
      signOut: { type: DataTypes.STRING },                  // optional
      submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Attendances", // 👈 force table name in MySQL
      timestamps: true,         // createdAt + updatedAt
    }
  );

  return Attendance;
};
