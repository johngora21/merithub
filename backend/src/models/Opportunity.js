const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Opportunity = sequelize.define('Opportunity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  organization: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  organization_logo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('Scholarships', 'Fellowships', 'Grants', 'Funds', 'Internships', 'Programs', 'Competitions', 'Research', 'Professional Development'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  amount_min: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  amount_max: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  duration: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  detailed_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  eligibility_criteria: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  application_process: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  benefits: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
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
    type: DataTypes.ENUM('active', 'closed', 'completed'),
    defaultValue: 'active'
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  applications_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  external_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  contact_email: {
    type: DataTypes.STRING(255),
    allowNull: true
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
  tableName: 'opportunities',
  timestamps: true,
  indexes: [
    { fields: ['organization'] },
    { fields: ['type'] },
    { fields: ['location'] },
    { fields: ['deadline'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
    { fields: ['approval_status'] }
  ]
});

module.exports = Opportunity;
