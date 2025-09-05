const { sequelize } = require('../../config/database');
const User = require('./User');
const Job = require('./Job');
const Tender = require('./Tender');
const Opportunity = require('./Opportunity');
const Application = require('./Application');
const Course = require('./Course');
const AdminLog = require('./AdminLog');
const UserSubscription = require('./UserSubscription');
const Notification = require('./Notification');
const SavedItem = require('./SavedItem');
const CourseEnrollment = require('./CourseEnrollment');

// Define associations
User.hasMany(Job, { foreignKey: 'created_by', as: 'createdJobs' });
Job.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Tender, { foreignKey: 'created_by', as: 'createdTenders' });
Tender.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Opportunity, { foreignKey: 'created_by', as: 'createdOpportunities' });
Opportunity.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });

Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

Tender.hasMany(Application, { foreignKey: 'tender_id', as: 'applications' });
Application.belongsTo(Tender, { foreignKey: 'tender_id', as: 'tender' });

Opportunity.hasMany(Application, { foreignKey: 'opportunity_id', as: 'applications' });
Application.belongsTo(Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });

User.hasMany(Application, { foreignKey: 'reviewed_by', as: 'reviewedApplications' });
Application.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

// Course associations
User.hasMany(Course, { foreignKey: 'created_by', as: 'createdCourses' });
Course.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Approver associations
User.hasMany(Job, { foreignKey: 'approved_by', as: 'approvedJobs' });
Job.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

User.hasMany(Tender, { foreignKey: 'approved_by', as: 'approvedTenders' });
Tender.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

User.hasMany(Opportunity, { foreignKey: 'approved_by', as: 'approvedOpportunities' });
Opportunity.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

User.hasMany(Course, { foreignKey: 'approved_by', as: 'approvedCourses' });
Course.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

// Admin Log associations
User.hasMany(AdminLog, { foreignKey: 'admin_id', as: 'adminLogs' });
AdminLog.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

// User Subscription associations
User.hasMany(UserSubscription, { foreignKey: 'user_id', as: 'subscriptions' });
UserSubscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Notification associations
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Saved Item associations
User.hasMany(SavedItem, { foreignKey: 'user_id', as: 'savedItems' });
SavedItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Job.hasMany(SavedItem, { foreignKey: 'job_id', as: 'savedByUsers' });
SavedItem.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

Tender.hasMany(SavedItem, { foreignKey: 'tender_id', as: 'savedByUsers' });
SavedItem.belongsTo(Tender, { foreignKey: 'tender_id', as: 'tender' });

Opportunity.hasMany(SavedItem, { foreignKey: 'opportunity_id', as: 'savedByUsers' });
SavedItem.belongsTo(Opportunity, { foreignKey: 'opportunity_id', as: 'opportunity' });

Course.hasMany(SavedItem, { foreignKey: 'course_id', as: 'savedByUsers' });
SavedItem.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Course Enrollment associations
User.hasMany(CourseEnrollment, { foreignKey: 'user_id', as: 'courseEnrollments' });
CourseEnrollment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Course.hasMany(CourseEnrollment, { foreignKey: 'course_id', as: 'enrollments' });
CourseEnrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Sync database
const syncDatabase = async () => {
  try {
    // Avoid ALTER to bypass MySQL index limit issues during runtime
    await sequelize.sync();
    console.log('✅ Database models synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database models:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Job,
  Tender,
  Opportunity,
  Application,
  Course,
  AdminLog,
  UserSubscription,
  Notification,
  SavedItem,
  CourseEnrollment,
  syncDatabase
};
