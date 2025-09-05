'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add price field to all content tables
    await queryInterface.addColumn('jobs', 'price', {
      type: Sequelize.ENUM('Free', 'Pro'),
      defaultValue: 'Free',
      allowNull: false
    });
    
    await queryInterface.addColumn('tenders', 'price', {
      type: Sequelize.ENUM('Free', 'Pro'),
      defaultValue: 'Free',
      allowNull: false
    });
    
    await queryInterface.addColumn('opportunities', 'price', {
      type: Sequelize.ENUM('Free', 'Pro'),
      defaultValue: 'Free',
      allowNull: false
    });
    
    await queryInterface.addColumn('courses', 'price', {
      type: Sequelize.ENUM('Free', 'Pro'),
      defaultValue: 'Free',
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove price field from all content tables
    await queryInterface.removeColumn('jobs', 'price');
    await queryInterface.removeColumn('tenders', 'price');
    await queryInterface.removeColumn('opportunities', 'price');
    await queryInterface.removeColumn('courses', 'price');
  }
};
