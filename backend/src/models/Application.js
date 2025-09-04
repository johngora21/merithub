const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Application = sequelize.define('Application', {
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
  application_type: {
    type: DataTypes.ENUM('job', 'tender', 'opportunity'),
    allowNull: false
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  tender_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tenders',
      key: 'id'
    }
  },
  opportunity_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'opportunities',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'under-review', 'shortlisted', 'rejected', 'accepted', 'withdrawn'),
    defaultValue: 'pending'
  },
  cover_letter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  application_data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  review_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'applications',
  timestamps: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['application_type'] },
    { fields: ['status'] },
    { fields: ['applied_at'] },
    { 
      unique: true,
      fields: ['user_id', 'job_id'],
      name: 'unique_job_application'
    },
    { 
      unique: true,
      fields: ['user_id', 'tender_id'],
      name: 'unique_tender_application'
    },
    { 
      unique: true,
      fields: ['user_id', 'opportunity_id'],
      name: 'unique_opportunity_application'
    }
  ]
});

module.exports = Application;
