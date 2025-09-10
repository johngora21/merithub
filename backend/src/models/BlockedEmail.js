const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const BlockedEmail = sequelize.define('BlockedEmail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  reason: {
    type: DataTypes.ENUM('user_deleted', 'spam', 'abuse', 'manual_block'),
    allowNull: false,
    defaultValue: 'user_deleted'
  },
  blocked_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  original_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'blocked_emails',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['reason'] },
    { fields: ['blocked_by'] },
    { fields: ['created_at'] }
  ]
});

module.exports = BlockedEmail;
