const { sequelize } = require('../config/database');
const User = require('../src/models/User');

async function fixDuplicateUserData() {
  try {
    console.log('Starting to fix duplicate user data...');

    // Get all users
    const users = await User.findAll();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`\nProcessing User ${user.id}: ${user.email}`);
      
      // Generate unique IDs for each user's data
      const baseTime = Date.now();
      
      // Fix education data
      if (user.education && Array.isArray(user.education)) {
        const fixedEducation = user.education.map((edu, index) => ({
          ...edu,
          id: baseTime + index + Math.random()
        }));
        await user.update({ education: fixedEducation });
        console.log(`Fixed education data for user ${user.id}`);
      }
      
      // Fix experience data
      if (user.experience && Array.isArray(user.experience)) {
        const fixedExperience = user.experience.map((exp, index) => ({
          ...exp,
          id: baseTime + index + Math.random()
        }));
        await user.update({ experience: fixedExperience });
        console.log(`Fixed experience data for user ${user.id}`);
      }
      
      // Fix skills data
      if (user.skills && Array.isArray(user.skills)) {
        const fixedSkills = user.skills.map((skill, index) => ({
          ...skill,
          id: baseTime + index + Math.random()
        }));
        await user.update({ skills: fixedSkills });
        console.log(`Fixed skills data for user ${user.id}`);
      }
      
      // Fix certificates data
      if (user.certificates && Array.isArray(user.certificates)) {
        const fixedCertificates = user.certificates.map((cert, index) => ({
          ...cert,
          id: baseTime + index + Math.random()
        }));
        await user.update({ certificates: fixedCertificates });
        console.log(`Fixed certificates data for user ${user.id}`);
      }
    }

    console.log('\nFinished fixing duplicate user data.');
  } catch (error) {
    console.error('Error fixing duplicate user data:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

fixDuplicateUserData();
