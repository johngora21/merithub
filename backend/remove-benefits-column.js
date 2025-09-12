const { sequelize } = require('./config/database');

async function removeBenefitsColumn() {
  try {
    console.log('Removing benefits column from courses table...');
    
    // Remove the benefits column from courses table
    await sequelize.query('ALTER TABLE courses DROP COLUMN benefits');
    
    console.log('✅ Benefits column removed successfully from courses table');
    
    // Also update the saved_items table ENUM to include the new course types
    console.log('Updating saved_items item_type ENUM...');
    await sequelize.query(`
      ALTER TABLE saved_items 
      MODIFY COLUMN item_type ENUM('job', 'tender', 'opportunity', 'course', 'video', 'book', 'business-plan') NOT NULL
    `);
    
    console.log('✅ saved_items item_type ENUM updated successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeBenefitsColumn();
