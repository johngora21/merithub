const { Job } = require('../src/models');

async function fixJobsTags() {
  try {
    console.log('Fixing tags in jobs table...');
    
    const jobs = await Job.findAll();
    let fixed = 0;
    
    for (const job of jobs) {
      if (job.tags && typeof job.tags === 'string') {
        try {
          // Parse the JSON string
          const parsed = JSON.parse(job.tags);
          if (Array.isArray(parsed)) {
            await job.update({ tags: parsed });
            console.log(`Fixed job ${job.id}: ${job.tags} -> ${JSON.stringify(parsed)}`);
            fixed++;
          }
        } catch (e) {
          console.log(`Job ${job.id} tags not JSON: ${job.tags}`);
        }
      }
    }
    
    console.log(`Fixed ${fixed} jobs`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixJobsTags();

