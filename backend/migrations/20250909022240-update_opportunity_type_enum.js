'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, update existing data to use display values
    await queryInterface.sequelize.query(`
      UPDATE opportunities 
      SET type = CASE 
        WHEN type = 'scholarship' THEN 'Scholarships'
        WHEN type = 'fellowship' THEN 'Fellowships'
        WHEN type = 'grant' THEN 'Grants'
        WHEN type = 'fund' THEN 'Funds'
        WHEN type = 'internship' THEN 'Internships'
        WHEN type = 'program' THEN 'Programs'
        WHEN type = 'competition' THEN 'Competitions'
        WHEN type = 'research' THEN 'Research'
        WHEN type = 'professional_development' THEN 'Professional Development'
        ELSE type
      END
    `);

    // Then update the ENUM to include display values
    await queryInterface.changeColumn('opportunities', 'type', {
      type: Sequelize.ENUM(
        'Scholarships', 'Fellowships', 'Grants', 'Funds', 
        'Internships', 'Programs', 'Competitions', 'Research', 
        'Professional Development'
      ),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert to normalized values
    await queryInterface.sequelize.query(`
      UPDATE opportunities 
      SET type = CASE 
        WHEN type = 'Scholarships' THEN 'scholarship'
        WHEN type = 'Fellowships' THEN 'fellowship'
        WHEN type = 'Grants' THEN 'grant'
        WHEN type = 'Funds' THEN 'fund'
        WHEN type = 'Internships' THEN 'internship'
        WHEN type = 'Programs' THEN 'program'
        WHEN type = 'Competitions' THEN 'competition'
        WHEN type = 'Research' THEN 'research'
        WHEN type = 'Professional Development' THEN 'professional_development'
        ELSE type
      END
    `);

    // Revert the ENUM to normalized values
    await queryInterface.changeColumn('opportunities', 'type', {
      type: Sequelize.ENUM('scholarship', 'fellowship', 'grant', 'program', 'internship', 'competition', 'volunteer'),
      allowNull: false
    });
  }
};