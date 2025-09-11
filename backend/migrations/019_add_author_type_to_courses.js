'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add author_type field to courses table
    await queryInterface.addColumn('courses', 'author_type', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove author_type field from courses table
    await queryInterface.removeColumn('courses', 'author_type');
  }
};
