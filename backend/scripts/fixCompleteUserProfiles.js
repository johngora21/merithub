const { sequelize } = require('../config/database');
const User = require('../src/models/User');

async function fixCompleteUserProfiles() {
  try {
    console.log('Starting to fix complete user profiles...');

    // Get all users
    const users = await User.findAll();
    console.log(`Found ${users.length} users`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`\nProcessing User ${user.id}: ${user.email}`);
      
      // Create completely unique profile data for each user
      const uniqueProfileData = {
        // Basic personal info
        first_name: i === 0 ? "John" : "Lilian",
        last_name: i === 0 ? "Gora" : "Chei",
        phone: `071058585${i + 1}`,
        bio: i === 0 
          ? "I'm John Gora—founder, platform architect, and strategic operator focused on building climate-smart systems, modular infrastructure, and investment platforms."
          : "Ecofy is designed with inclusivity in mind. Our mobile-first platform includes offline capabilities and SMS-based services, ensuring even farmers in remote areas can benefit.",
        
        // Personal details - make them unique
        nationality: i === 0 ? "Tanzania" : "Thailand",
        country_of_residence: "Tanzania",
        date_of_birth: i === 0 ? "1995-03-15" : "2001-09-21",
        gender: i === 0 ? "Male" : "Female",
        marital_status: i === 0 ? "Single" : "Single",
        disability_status: "No disability",
        languages: i === 0 ? "English, Swahili" : "English, Swahili and French",
        
        // Professional info
        industry: i === 0 ? "Technology" : "Transportation",
        current_job_title: i === 0 ? "Software Developer" : "Procurement Officer",
        employment_status: "employed",
        
        // Education - make it unique per user
        education: [
          {
            id: Date.now() + (i * 1000) + 1,
            level: "Bachelor Degree",
            program: i === 0 ? "Computer Science" : "BSc in Laboratory Science",
            school: i === 0 ? "University of Dar es Salaam" : "KCMC",
            location: i === 0 ? "Dar es Salaam" : "Kilimanjaro",
            period: i === 0 ? "2018-2022" : "2019-2023",
            gpa: i === 0 ? "3.8" : "4.2"
          },
          {
            id: Date.now() + (i * 1000) + 2,
            level: "High School",
            program: i === 0 ? "Science" : "PCB",
            school: i === 0 ? "St. Mary's High School" : "Scholastica High School",
            location: i === 0 ? "Dar es Salaam" : "Kilimanjaro",
            period: i === 0 ? "2014-2017" : "2015-2018",
            gpa: i === 0 ? "Div 1" : "Div 2"
          }
        ],
        
        // Experience - make it unique per user
        experience: [
          {
            id: Date.now() + (i * 1000) + 3,
            title: i === 0 ? "Software Developer" : "Lab Technician",
            company: i === 0 ? "Tech Solutions Ltd" : "Mwananyamala Regional Refereal Hospital",
            industry: i === 0 ? "Technology" : "Healthcare",
            location: "Dar es Salaam",
            startMonth: "01",
            startYear: "2022",
            endMonth: "12",
            endYear: "2024",
            isCurrent: true,
            type: "full-time",
            description: i === 0 
              ? "Developed web applications using React and Node.js"
              : "Conducted laboratory tests and analysis"
          },
          {
            id: Date.now() + (i * 1000) + 4,
            title: i === 0 ? "Junior Developer" : "Lab technician Intern",
            company: i === 0 ? "Startup Inc" : "Muhimbili National Hospital",
            industry: i === 0 ? "Technology" : "Healthcare",
            location: "Dar es Salaam",
            startMonth: "06",
            startYear: "2021",
            endMonth: "12",
            endYear: "2021",
            isCurrent: false,
            type: "internship",
            description: i === 0 
              ? "Worked on mobile app development using Flutter"
              : "Assisted in laboratory procedures and data collection"
          }
        ],
        
        // Skills - make it unique per user
        skills: [
          {
            id: Date.now() + (i * 1000) + 5,
            name: i === 0 ? "JavaScript" : "Project Management",
            level: "Advanced",
            category: i === 0 ? "Programming" : "Management",
            description: i === 0 ? "Full-stack JavaScript development" : "Project planning and execution"
          },
          {
            id: Date.now() + (i * 1000) + 6,
            name: i === 0 ? "React" : "Laboratory Analysis",
            level: "Advanced",
            category: i === 0 ? "Frontend" : "Technical",
            description: i === 0 ? "React.js and React Native development" : "Scientific analysis and testing"
          }
        ],
        
        // Certificates - make it unique per user
        certificates: [
          {
            id: Date.now() + (i * 1000) + 7,
            name: i === 0 ? "AWS Certified Developer" : "CPA",
            issuing_organization: i === 0 ? "Amazon Web Services" : "RONA CONSULTANTS",
            issue_date: i === 0 ? "2023-06-15" : "2023-03-20",
            expiry_date: i === 0 ? "2026-06-15" : "2025-03-20",
            credential_id: i === 0 ? "AWS-DEV-12345" : "CPA-78901",
            certificate_type: i === 0 ? "Cloud Computing" : "Professional",
            certificate_file: i === 0 ? "aws-cert.pdf" : "cpa-cert.pdf"
          }
        ]
      };
      
      // Update user with completely unique data
      await user.update(uniqueProfileData);
      console.log(`Updated complete profile for user ${user.id} (${user.email})`);
    }

    console.log('\nFinished fixing complete user profiles.');
  } catch (error) {
    console.error('Error fixing user profiles:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

fixCompleteUserProfiles();
