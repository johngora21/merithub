const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AdminLog = sequelize.define('AdminLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  resource_type: {
    type: DataTypes.ENUM('user', 'job', 'tender', 'opportunity', 'application', 'course', 'system'),
    allowNull: false
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  old_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  new_values: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'admin_logs',
  timestamps: true,
  indexes: [
    { fields: ['admin_id'] },
    { fields: ['action'] },
    { fields: ['resource_type'] },
    { fields: ['created_at'] }
  ]
});

module.exports = AdminLog;
