'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the category column from courses table
    await queryInterface.removeColumn('courses', 'category');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the category column back if needed
    await queryInterface.addColumn('courses', 'category', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
