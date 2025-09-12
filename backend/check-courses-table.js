const { sequelize } = require('./config/database');

async function checkCoursesTable() {
  try {
    console.log('Checking courses table structure...');
    
    // Get table structure
    const [results] = await sequelize.query('DESCRIBE courses');
    
    console.log('Courses table columns:');
    results.forEach(row => {
      console.log(`- ${row.Field} (${row.Type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCoursesTable();
