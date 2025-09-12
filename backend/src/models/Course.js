const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  detailed_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  instructor: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  instructor_bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subcategory: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false
  },
  duration_hours: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  materials: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  learning_objectives: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  prerequisites: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  curriculum: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  is_free: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  enrollment_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approval_status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved'
  },
  approved_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  course_type: {
    type: DataTypes.ENUM('video', 'book', 'business-plan'),
    allowNull: true
  },
  language: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'English'
  },
  format: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  business_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  industry_sector: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  stage: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  page_count: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  file_size: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  target_audience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  download_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  author_type: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'courses',
  timestamps: true,
  indexes: [
    { fields: ['level'] },
    { fields: ['status'] },
    { fields: ['is_free'] },
    { fields: ['created_at'] },
    { fields: ['approval_status'] }
  ]
});

module.exports = Course;
