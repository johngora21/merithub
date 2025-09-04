-- Add cover_image column to tenders table
ALTER TABLE tenders ADD COLUMN cover_image VARCHAR(500) AFTER organization_logo;
