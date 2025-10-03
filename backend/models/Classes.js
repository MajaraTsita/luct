// backend/models/Class.js
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("Class", {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    class_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    course_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    lecturer_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    semester: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    schedule_day: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    schedule_time: { 
      type: DataTypes.TIME, 
      allowNull: false 
    },
    room: { 
      type: DataTypes.STRING 
    },
    max_students: { 
      type: DataTypes.INTEGER, 
      defaultValue: 30 
    },
    current_students: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    }
  });

  // Associations (optional, if you plan to link with other models)
  Class.associate = (models) => {
    // Example: if you have a Student model
    // Class.hasMany(models.Student, { foreignKey: 'classId', as: 'students' });
  };

  return Class;
};
