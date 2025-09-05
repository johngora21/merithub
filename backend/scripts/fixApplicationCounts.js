const { Application, Job, Tender, Opportunity } = require('../src/models');

async function fixApplicationCounts() {
  try {
    console.log('Starting to fix application counts...');
    
    // Get all jobs and update their application counts
    const jobs = await Job.findAll();
    console.log(`Found ${jobs.length} jobs`);
    
    for (const job of jobs) {
      const applicationCount = await Application.count({
        where: { job_id: job.id }
      });
      
      await job.update({ applications_count: applicationCount });
      console.log(`Updated Job ${job.id} (${job.title}): ${applicationCount} applications`);
    }
    
    // Get all tenders and update their submission counts
    const tenders = await Tender.findAll();
    console.log(`Found ${tenders.length} tenders`);
    
    for (const tender of tenders) {
      const submissionCount = await Application.count({
        where: { tender_id: tender.id }
      });
      
      await tender.update({ submissions_count: submissionCount });
      console.log(`Updated Tender ${tender.id} (${tender.title}): ${submissionCount} submissions`);
    }
    
    // Get all opportunities and update their application counts
    const opportunities = await Opportunity.findAll();
    console.log(`Found ${opportunities.length} opportunities`);
    
    for (const opportunity of opportunities) {
      const applicationCount = await Application.count({
        where: { opportunity_id: opportunity.id }
      });
      
      await opportunity.update({ applications_count: applicationCount });
      console.log(`Updated Opportunity ${opportunity.id} (${opportunity.title}): ${applicationCount} applications`);
    }
    
    console.log('✅ All application counts have been fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing application counts:', error);
  } finally {
    process.exit(0);
  }
}

fixApplicationCounts();
