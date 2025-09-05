const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  company: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  company_logo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  salary_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  salary_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  job_type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship'),
    allowNull: false
  },
  experience_level: {
    type: DataTypes.ENUM('entry', 'junior', 'mid', 'senior', 'executive'),
    allowNull: false
  },
  work_type: {
    type: DataTypes.ENUM('remote', 'hybrid', 'on-site'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  benefits: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  posted_by: {
    type: DataTypes.ENUM('platform', 'company', 'individual'),
    allowNull: false
  },
  external_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  contact_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_urgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'closed', 'expired'),
    defaultValue: 'active'
  },
  application_deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  applications_count: {
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
    defaultValue: 'pending'
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
  price: {
    type: DataTypes.ENUM('Free', 'Pro'),
    defaultValue: 'Free',
    allowNull: false
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  indexes: [
    { fields: ['company'] },
    { fields: ['location'] },
    { fields: ['job_type'] },
    { fields: ['experience_level'] },
    { fields: ['status'] },
    { fields: ['posted_by'] },
    { fields: ['created_at'] },
    { fields: ['approval_status'] }
  ]
});

module.exports = Job;
