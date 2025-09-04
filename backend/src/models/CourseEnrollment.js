const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const CourseEnrollment = sequelize.define('CourseEnrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('enrolled', 'in-progress', 'completed', 'dropped'),
    defaultValue: 'enrolled'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  completed_lessons: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_lessons: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  time_spent: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // in minutes
  },
  last_accessed: {
    type: DataTypes.DATE,
    allowNull: true
  },
  enrolled_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  certificate_issued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  certificate_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'course_enrollments',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['course_id'] },
    { fields: ['status'] },
    { 
      unique: true,
      fields: ['user_id', 'course_id'],
      name: 'unique_user_course_enrollment'
    }
  ]
});

module.exports = CourseEnrollment;
