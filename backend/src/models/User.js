const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
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
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  profile_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
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
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  experience_level: {
    type: DataTypes.ENUM('entry', 'junior', 'mid', 'senior', 'executive'),
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  current_job_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  employment_status: {
    type: DataTypes.ENUM('employed', 'unemployed', 'self-employed', 'student', 'retired', 'freelancer'),
    allowNull: true
  },
  linkedin_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  subscription_type: {
    type: DataTypes.ENUM('free', 'premium', 'enterprise'),
    defaultValue: 'free'
  },
  subscription_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  user_type: {
    type: DataTypes.ENUM('student', 'job_seeker', 'professional', 'researcher', 'entrepreneur', 'employer', 'contractor', 'consultant'),
    allowNull: true
  },
  marital_status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country_of_residence: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  disability_status: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  languages: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  profile_link1_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link1_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  profile_link2_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link2_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  profile_link3_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  profile_link3_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  education: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  experience: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['subscription_type'] },
    { fields: ['location'] },
    { fields: ['industry'] }
  ]
});

User.beforeCreate(async (user) => {
  if (user.password_hash) {
    user.password_hash = await bcrypt.hash(user.password_hash, 12);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password_hash')) {
    user.password_hash = await bcrypt.hash(user.password_hash, 12);
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password_hash;
  return values;
};

module.exports = User;
