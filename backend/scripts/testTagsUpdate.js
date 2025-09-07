const { Job } = require('../src/models');
const { sequelize } = require('../config/database');

async function testTagsUpdate() {
  try {
    console.log('🔍 Testing tags update...');
    
    // Get a job with tags
    const job = await Job.findOne({
      where: { id: 1 },
      attributes: ['id', 'title', 'tags']
    });
    
    console.log('📊 Current tags in database:');
    console.log(`Job ${job.id}: ${JSON.stringify(job.tags)}`);
    
    // Simulate what happens when we send tags[] array
    const mockReqBody = {
      title: job.title,
      tags: ['tag1', 'tag2', 'tag3'] // This is what express.urlencoded produces from tags[]
    };
    
    console.log('\n📤 Mock request body (what backend receives):');
    console.log(`tags: ${JSON.stringify(mockReqBody.tags)} (type: ${typeof mockReqBody.tags})`);
    
    // Test the update
    await job.update({ tags: mockReqBody.tags });
    
    // Check what was actually saved
    await job.reload();
    console.log('\n💾 After update:');
    console.log(`tags: ${JSON.stringify(job.tags)} (type: ${typeof job.tags})`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

testTagsUpdate();

