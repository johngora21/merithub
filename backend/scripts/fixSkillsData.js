const { Job, Tender, Opportunity } = require('../src/models');
const { sequelize } = require('../config/database');

async function fixSkillsData() {
  try {
    console.log('🔧 Starting skills data cleanup...');
    
    // Fix Jobs table
    console.log('📝 Fixing Jobs table...');
    const jobs = await Job.findAll();
    let jobsFixed = 0;
    
    for (const job of jobs) {
      if (job.skills && typeof job.skills === 'string' && job.skills.startsWith('[')) {
        try {
          const parsedSkills = JSON.parse(job.skills);
          if (Array.isArray(parsedSkills)) {
            await job.update({ skills: parsedSkills });
            jobsFixed++;
            console.log(`✅ Fixed job ${job.id}: ${job.skills} → ${JSON.stringify(parsedSkills)}`);
          }
        } catch (e) {
          console.log(`❌ Failed to parse skills for job ${job.id}: ${job.skills}`);
        }
      }
    }
    
    // Fix Tenders table
    console.log('📝 Fixing Tenders table...');
    const tenders = await Tender.findAll();
    let tendersFixed = 0;
    
    for (const tender of tenders) {
      if (tender.requirements && typeof tender.requirements === 'string' && tender.requirements.startsWith('[')) {
        try {
          const parsedRequirements = JSON.parse(tender.requirements);
          if (Array.isArray(parsedRequirements)) {
            await tender.update({ requirements: parsedRequirements });
            tendersFixed++;
            console.log(`✅ Fixed tender ${tender.id}: ${tender.requirements} → ${JSON.stringify(parsedRequirements)}`);
          }
        } catch (e) {
          console.log(`❌ Failed to parse requirements for tender ${tender.id}: ${tender.requirements}`);
        }
      }
    }
    
    // Fix Opportunities table
    console.log('📝 Fixing Opportunities table...');
    const opportunities = await Opportunity.findAll();
    let opportunitiesFixed = 0;
    
    for (const opportunity of opportunities) {
      if (opportunity.requirements && typeof opportunity.requirements === 'string' && opportunity.requirements.startsWith('[')) {
        try {
          const parsedRequirements = JSON.parse(opportunity.requirements);
          if (Array.isArray(parsedRequirements)) {
            await opportunity.update({ requirements: parsedRequirements });
            opportunitiesFixed++;
            console.log(`✅ Fixed opportunity ${opportunity.id}: ${opportunity.requirements} → ${JSON.stringify(parsedRequirements)}`);
          }
        } catch (e) {
          console.log(`❌ Failed to parse requirements for opportunity ${opportunity.id}: ${opportunity.requirements}`);
        }
      }
    }
    
    console.log('\n🎉 Cleanup completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Jobs fixed: ${jobsFixed}`);
    console.log(`   - Tenders fixed: ${tendersFixed}`);
    console.log(`   - Opportunities fixed: ${opportunitiesFixed}`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await sequelize.close();
  }
}

fixSkillsData();
