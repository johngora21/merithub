const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Tender = sequelize.define('Tender', {
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
  cover_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  sector: {
    type: DataTypes.ENUM('construction', 'technology', 'healthcare', 'education', 'government', 'manufacturing', 'logistics', 'energy', 'agriculture', 'finance', 'retail', 'transportation', 'utilities', 'consulting', 'media', 'hospitality', 'real_estate', 'legal', 'non_profit', 'other'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contract_value_min: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  contract_value_max: {
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
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATEONLY,
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
  project_scope: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  technical_requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  organization_info: {
    type: DataTypes.JSON,
    allowNull: true
  },
  submission_process: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  evaluation_criteria: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  submission_type: {
    type: DataTypes.ENUM('online-portal', 'electronic', 'sealed-bid', 'proposal', 'technical'),
    allowNull: false
  },
  is_urgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bond_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  prequalification_required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'awarded', 'cancelled'),
    defaultValue: 'active'
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  submissions_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  external_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'tenders',
  timestamps: true,
  indexes: [
    { fields: ['organization'] },
    { fields: ['sector'] },
    { fields: ['location'] },
    { fields: ['deadline'] },
    { fields: ['status'] },
    { fields: ['created_at'] }
  ]
});

module.exports = Tender;
