// backend/models/rating.js
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("Rating", {
    lectureName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lecturePerformance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentBehavior: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // ✅ must match table name from User model
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  // 🔗 Associations
  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Rating;
};
