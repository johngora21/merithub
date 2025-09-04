-- Add profile data fields to users table
ALTER TABLE `users` 
ADD COLUMN `education` JSON DEFAULT NULL,
ADD COLUMN `certificates` JSON DEFAULT NULL,
ADD COLUMN `experience` JSON DEFAULT NULL,
ADD COLUMN `documents` JSON DEFAULT NULL;
