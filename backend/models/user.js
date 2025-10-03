// backend/models/user.js
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // ✅ easier than index if single field
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("STUDENT", "LECTURER", "PRL", "PL"),
        allowNull: false,
      },
      studentNumber: {
        type: DataTypes.STRING(9),
        allowNull: true,
        validate: {
          len: [9, 9], // must be exactly 9 digits if provided
        },
      },
    },
    {
      hooks: {
        // ✅ Automatically hash password before saving
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  // 🔗 Associations
  User.associate = (models) => {
    User.hasMany(models.Rating, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  // ✅ Instance method for password validation
  User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
