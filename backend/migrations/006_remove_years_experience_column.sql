-- Migration to remove years_experience column from users table
-- This column is no longer needed as we calculate experience from the experience JSON array

ALTER TABLE users DROP COLUMN years_experience;
