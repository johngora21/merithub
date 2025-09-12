/* eslint-disable */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const table = 'courses';
      const column = 'downloads';
      const [results] = await queryInterface.sequelize.query(`SHOW COLUMNS FROM \`${table}\` LIKE '${column}';`);
      if (Array.isArray(results) && results.length > 0) {
        return;
      }
      await queryInterface.addColumn(table, column, {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    } catch (err) {
      console.error('Migration up error (add downloads to courses):', err);
      throw err;
    }
  },

  down: async (queryInterface) => {
    try {
      const table = 'courses';
      const column = 'downloads';
      await queryInterface.removeColumn(table, column);
    } catch (err) {
      console.error('Migration down error (remove downloads from courses):', err);
      throw err;
    }
  }
}


