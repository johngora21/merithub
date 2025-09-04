const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const SavedItem = sequelize.define('SavedItem', {
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
  item_type: {
    type: DataTypes.ENUM('job', 'tender', 'opportunity', 'course'),
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
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'saved_items',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['item_type'] },
    { 
      unique: true,
      fields: ['user_id', 'job_id'],
      name: 'unique_saved_job'
    },
    { 
      unique: true,
      fields: ['user_id', 'tender_id'],
      name: 'unique_saved_tender'
    },
    { 
      unique: true,
      fields: ['user_id', 'opportunity_id'],
      name: 'unique_saved_opportunity'
    },
    { 
      unique: true,
      fields: ['user_id', 'course_id'],
      name: 'unique_saved_course'
    }
  ]
});

module.exports = SavedItem;
