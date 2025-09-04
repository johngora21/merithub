const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const UserSubscription = sequelize.define('UserSubscription', {
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
  subscription_type: {
    type: DataTypes.ENUM('free', 'premium', 'enterprise'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired', 'pending'),
    defaultValue: 'active'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  auto_renew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  payment_method: {
    type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer', 'free'),
    allowNull: true
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  limits: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'user_subscriptions',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['subscription_type'] },
    { fields: ['status'] },
    { fields: ['end_date'] }
  ]
});

module.exports = UserSubscription;
