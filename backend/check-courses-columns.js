const { sequelize } = require('./config/database');

async function checkCoursesColumns() {
  try {
    console.log('Checking courses table structure...');
    
    // Get table structure
    const [results] = await sequelize.query('DESCRIBE courses');
    
    console.log('Courses table columns:');
    results.forEach(row => {
      console.log(`- ${row.Field} (${row.Type})`);
    });
    
    // Check if benefits column exists
    const hasBenefits = results.some(row => row.Field === 'benefits');
    const hasExternalUrl = results.some(row => row.Field === 'external_url');
    
    console.log('\nColumn checks:');
    console.log(`- benefits column exists: ${hasBenefits}`);
    console.log(`- external_url column exists: ${hasExternalUrl}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCoursesColumns();
