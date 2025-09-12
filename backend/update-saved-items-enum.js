const { sequelize } = require('./config/database');

async function updateSavedItemsEnum() {
  try {
    console.log('Updating saved_items item_type ENUM...');
    
    // Update the saved_items table ENUM to include the new course types
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

updateSavedItemsEnum();
