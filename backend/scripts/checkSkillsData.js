const { Job } = require('../src/models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

async function checkSkillsData() {
  try {
    console.log('🔍 Checking skills data in database...');
    
    const jobs = await Job.findAll({
      attributes: ['id', 'title', 'skills'],
      where: {
        skills: {
          [Op.ne]: null
        }
      },
      limit: 5
    });
    
    console.log('📊 Current skills data:');
    jobs.forEach(job => {
      console.log(`Job ${job.id} (${job.title}):`);
      console.log(`  Type: ${typeof job.skills}`);
      console.log(`  Value: ${JSON.stringify(job.skills)}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await sequelize.close();
  }
}

checkSkillsData();
