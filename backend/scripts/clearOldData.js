const { Job, Tender, Opportunity, Course } = require('../src/models');
const { sequelize } = require('../config/database');

async function clearOldData() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Clear Jobs table
    console.log('🗑️ Clearing Jobs table...');
    const jobsDeleted = await Job.destroy({ where: {} });
    console.log(`✅ Deleted ${jobsDeleted} jobs`);
    
    // Clear Tenders table
    console.log('🗑️ Clearing Tenders table...');
    const tendersDeleted = await Tender.destroy({ where: {} });
    console.log(`✅ Deleted ${tendersDeleted} tenders`);
    
    // Clear Opportunities table
    console.log('🗑️ Clearing Opportunities table...');
    const opportunitiesDeleted = await Opportunity.destroy({ where: {} });
    console.log(`✅ Deleted ${opportunitiesDeleted} opportunities`);
    
    // Clear Courses table
    console.log('🗑️ Clearing Courses table...');
    const coursesDeleted = await Course.destroy({ where: {} });
    console.log(`✅ Deleted ${coursesDeleted} courses`);
    
    console.log('\n🎉 Database cleanup completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Jobs deleted: ${jobsDeleted}`);
    console.log(`   - Tenders deleted: ${tendersDeleted}`);
    console.log(`   - Opportunities deleted: ${opportunitiesDeleted}`);
    console.log(`   - Courses deleted: ${coursesDeleted}`);
    console.log('\n✨ You can now input fresh data!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await sequelize.close();
  }
}

clearOldData();

