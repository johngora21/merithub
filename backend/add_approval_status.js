const mysql = require('mysql2/promise');
require('dotenv').config();

async function addApprovalStatusFields() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'merit_platform'
  });

  try {
    console.log('🔄 Adding approval status fields to content tables...');

    // Add approval status fields to jobs table
    try {
      await connection.execute(`
        ALTER TABLE jobs 
        ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        ADD COLUMN approved_by INT NULL,
        ADD COLUMN approved_at TIMESTAMP NULL,
        ADD COLUMN rejection_reason TEXT NULL
      `);
      console.log('✅ Added approval status fields to jobs table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ Jobs table approval fields already exist');
      } else {
        console.error('❌ Error adding fields to jobs table:', error.message);
      }
    }

    // Add approval status fields to tenders table
    try {
      await connection.execute(`
        ALTER TABLE tenders 
        ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        ADD COLUMN approved_by INT NULL,
        ADD COLUMN approved_at TIMESTAMP NULL,
        ADD COLUMN rejection_reason TEXT NULL
      `);
      console.log('✅ Added approval status fields to tenders table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ Tenders table approval fields already exist');
      } else {
        console.error('❌ Error adding fields to tenders table:', error.message);
      }
    }

    // Add approval status fields to opportunities table
    try {
      await connection.execute(`
        ALTER TABLE opportunities 
        ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        ADD COLUMN approved_by INT NULL,
        ADD COLUMN approved_at TIMESTAMP NULL,
        ADD COLUMN rejection_reason TEXT NULL
      `);
      console.log('✅ Added approval status fields to opportunities table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ Opportunities table approval fields already exist');
      } else {
        console.error('❌ Error adding fields to opportunities table:', error.message);
      }
    }

    // Add approval status fields to courses table
    try {
      await connection.execute(`
        ALTER TABLE courses 
        ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        ADD COLUMN approved_by INT NULL,
        ADD COLUMN approved_at TIMESTAMP NULL,
        ADD COLUMN rejection_reason TEXT NULL
      `);
      console.log('✅ Added approval status fields to courses table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ Courses table approval fields already exist');
      } else {
        console.error('❌ Error adding fields to courses table:', error.message);
      }
    }

    // Add foreign key constraints
    try {
      await connection.execute(`
        ALTER TABLE jobs ADD CONSTRAINT fk_jobs_approved_by FOREIGN KEY (approved_by) REFERENCES users(id)
      `);
      console.log('✅ Added foreign key constraint for jobs table');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✅ Jobs foreign key constraint already exists');
      } else {
        console.error('❌ Error adding jobs foreign key:', error.message);
      }
    }

    try {
      await connection.execute(`
        ALTER TABLE tenders ADD CONSTRAINT fk_tenders_approved_by FOREIGN KEY (approved_by) REFERENCES users(id)
      `);
      console.log('✅ Added foreign key constraint for tenders table');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✅ Tenders foreign key constraint already exists');
      } else {
        console.error('❌ Error adding tenders foreign key:', error.message);
      }
    }

    try {
      await connection.execute(`
        ALTER TABLE opportunities ADD CONSTRAINT fk_opportunities_approved_by FOREIGN KEY (approved_by) REFERENCES users(id)
      `);
      console.log('✅ Added foreign key constraint for opportunities table');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✅ Opportunities foreign key constraint already exists');
      } else {
        console.error('❌ Error adding opportunities foreign key:', error.message);
      }
    }

    try {
      await connection.execute(`
        ALTER TABLE courses ADD CONSTRAINT fk_courses_approved_by FOREIGN KEY (approved_by) REFERENCES users(id)
      `);
      console.log('✅ Added foreign key constraint for courses table');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✅ Courses foreign key constraint already exists');
      } else {
        console.error('❌ Error adding courses foreign key:', error.message);
      }
    }

    // Add indexes for approval status
    try {
      await connection.execute(`CREATE INDEX idx_jobs_approval_status ON jobs(approval_status)`);
      console.log('✅ Added index for jobs approval status');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✅ Jobs approval status index already exists');
      } else {
        console.error('❌ Error adding jobs approval index:', error.message);
      }
    }

    try {
      await connection.execute(`CREATE INDEX idx_tenders_approval_status ON tenders(approval_status)`);
      console.log('✅ Added index for tenders approval status');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✅ Tenders approval status index already exists');
      } else {
        console.error('❌ Error adding tenders approval index:', error.message);
      }
    }

    try {
      await connection.execute(`CREATE INDEX idx_opportunities_approval_status ON opportunities(approval_status)`);
      console.log('✅ Added index for opportunities approval status');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✅ Opportunities approval status index already exists');
      } else {
        console.error('❌ Error adding opportunities approval index:', error.message);
      }
    }

    try {
      await connection.execute(`CREATE INDEX idx_courses_approval_status ON courses(approval_status)`);
      console.log('✅ Added index for courses approval status');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✅ Courses approval status index already exists');
      } else {
        console.error('❌ Error adding courses approval index:', error.message);
      }
    }

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

addApprovalStatusFields();
