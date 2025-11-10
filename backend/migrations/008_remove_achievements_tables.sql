-- Migration 008: Remove Achievements and UserAchievements tables
-- Achievements are now handled in code (backend/constants/achievements.js) instead of database
-- This simplifies achievement management and removes need for SQL migrations when adding new achievements

-- Drop UserAchievements table first (has foreign key to Achievements)
DROP TABLE IF EXISTS "UserAchievements" CASCADE;

-- Drop Achievements table
DROP TABLE IF EXISTS "Achievements" CASCADE;

-- Note: Achievement tracking will now be done in application code
-- The game will check achievement unlock conditions on-the-fly
-- No persistent storage of achievements needed
