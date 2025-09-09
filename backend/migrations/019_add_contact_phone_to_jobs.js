const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('jobs', 'contact_phone', {
      type: DataTypes.STRING(20),
      allowNull: true,
      after: 'contact_email'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('jobs', 'contact_phone');
  }
};
