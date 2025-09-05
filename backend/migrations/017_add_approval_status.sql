-- Add approval status fields to all content tables

-- Add approval status to jobs table
ALTER TABLE jobs ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
ALTER TABLE jobs ADD COLUMN approved_by INT NULL;
ALTER TABLE jobs ADD COLUMN approved_at TIMESTAMP NULL;
ALTER TABLE jobs ADD COLUMN rejection_reason TEXT NULL;

-- Add approval status to tenders table
ALTER TABLE tenders ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
ALTER TABLE tenders ADD COLUMN approved_by INT NULL;
ALTER TABLE tenders ADD COLUMN approved_at TIMESTAMP NULL;
ALTER TABLE tenders ADD COLUMN rejection_reason TEXT NULL;

-- Add approval status to opportunities table
ALTER TABLE opportunities ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
ALTER TABLE opportunities ADD COLUMN approved_by INT NULL;
ALTER TABLE opportunities ADD COLUMN approved_at TIMESTAMP NULL;
ALTER TABLE opportunities ADD COLUMN rejection_reason TEXT NULL;

-- Add approval status to courses table
ALTER TABLE courses ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
ALTER TABLE courses ADD COLUMN approved_by INT NULL;
ALTER TABLE courses ADD COLUMN approved_at TIMESTAMP NULL;
ALTER TABLE courses ADD COLUMN rejection_reason TEXT NULL;

-- Add foreign key constraints for approved_by
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_approved_by FOREIGN KEY (approved_by) REFERENCES users(id);
ALTER TABLE tenders ADD CONSTRAINT fk_tenders_approved_by FOREIGN KEY (approved_by) REFERENCES users(id);
ALTER TABLE opportunities ADD CONSTRAINT fk_opportunities_approved_by FOREIGN KEY (approved_by) REFERENCES users(id);
ALTER TABLE courses ADD CONSTRAINT fk_courses_approved_by FOREIGN KEY (approved_by) REFERENCES users(id);

-- Add indexes for approval status
CREATE INDEX idx_jobs_approval_status ON jobs(approval_status);
CREATE INDEX idx_tenders_approval_status ON tenders(approval_status);
CREATE INDEX idx_opportunities_approval_status ON opportunities(approval_status);
CREATE INDEX idx_courses_approval_status ON courses(approval_status);
