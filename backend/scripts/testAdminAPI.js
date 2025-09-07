const { Job } = require('../src/models');
const { sequelize } = require('../config/database');

async function testAdminAPI() {
  try {
    console.log('🔍 Testing what admin API returns...');
    
    const job = await Job.findOne({
      where: { id: 1 },
      attributes: ['id', 'title', 'skills', 'benefits']
    });
    
    console.log('📊 Raw database data:');
    console.log(`Skills: ${JSON.stringify(job.skills)} (type: ${typeof job.skills})`);
    console.log(`Benefits: ${JSON.stringify(job.benefits)} (type: ${typeof job.benefits})`);
    
    // Simulate admin controller transformation
    const transformedJob = {
      id: job.id,
      title: job.title,
      skills: Array.isArray(job.skills) ? job.skills : (job.skills ? job.skills.split(',').map(s => s.trim()).filter(Boolean) : []),
      benefits: Array.isArray(job.benefits) ? job.benefits : (job.benefits ? [job.benefits] : [])
    };
    
    console.log('\n📤 What admin controller sends:');
    console.log(`Skills: ${JSON.stringify(transformedJob.skills)} (type: ${typeof transformedJob.skills})`);
    console.log(`Benefits: ${JSON.stringify(transformedJob.benefits)} (type: ${typeof transformedJob.benefits})`);
    
    // Simulate Content.jsx transformation
    const contentTransformed = {
      skills: Array.isArray(transformedJob.skills) ? transformedJob.skills.join(', ') : (transformedJob.skills || ''),
      benefits: Array.isArray(transformedJob.benefits) ? transformedJob.benefits.join(', ') : (transformedJob.benefits || '')
    };
    
    console.log('\n📝 What Content.jsx sends to Post.jsx:');
    console.log(`Skills: "${contentTransformed.skills}" (type: ${typeof contentTransformed.skills})`);
    console.log(`Benefits: "${contentTransformed.benefits}" (type: ${typeof contentTransformed.benefits})`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

testAdminAPI();

