-- Migration 004: Remove redundancies and optimize database schema
-- This migration removes duplicate data tracked in PlayerStatistics that can be derived from other tables

-- PART 1: Remove redundant difficulty tracking from PlayerStatistics
-- (CareerHistory already tracks difficulty per game)
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "easyGamesPlayed";
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "mediumGamesPlayed";
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "hardGamesPlayed";
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "expertGamesPlayed";

-- PART 2: Remove redundant career length tracking
-- (CareerHistory.weeksPlayed already tracks this)
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "longestCareerWeeks";

-- PART 3: Remove redundant high score tracking
-- (CareerHistory already has peakCash, peakFame, peakCareerLevel)
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "highestCash";
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "highestFame";
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "highestCareerProgress";

-- PART 4: Remove redundant last played tracking
-- (Can be derived from GameSaves.lastPlayedAt)
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "lastPlayedAt";

-- PART 5: Remove unused User.profileData field
ALTER TABLE "Users" DROP COLUMN IF EXISTS "profileData";

-- PART 6: Remove GameSave.saveName (generated dynamically from artistName + genre)
ALTER TABLE "GameSaves" DROP COLUMN IF EXISTS "saveName";

-- PART 7: Remove invalid CareerHistory.gameId reference
ALTER TABLE "CareerHistories" DROP COLUMN IF EXISTS "gameId";

-- Add comment
COMMENT ON TABLE "PlayerStatistics" IS 'Optimized player statistics - redundancies removed (2025)';
