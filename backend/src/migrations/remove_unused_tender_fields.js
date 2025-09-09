const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove project_scope and technical_requirements columns from tenders table
    await queryInterface.removeColumn('tenders', 'project_scope');
    await queryInterface.removeColumn('tenders', 'technical_requirements');
  },

  down: async (queryInterface, Sequelize) => {
    // Add them back if needed to rollback
    await queryInterface.addColumn('tenders', 'project_scope', {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.addColumn('tenders', 'technical_requirements', {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    });
  }
};
