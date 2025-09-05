-- Add price field to all content tables
ALTER TABLE jobs ADD COLUMN price ENUM('Free', 'Pro') DEFAULT 'Free' NOT NULL;
ALTER TABLE tenders ADD COLUMN price ENUM('Free', 'Pro') DEFAULT 'Free' NOT NULL;
ALTER TABLE opportunities ADD COLUMN price ENUM('Free', 'Pro') DEFAULT 'Free' NOT NULL;
ALTER TABLE courses ADD COLUMN price ENUM('Free', 'Pro') DEFAULT 'Free' NOT NULL;
