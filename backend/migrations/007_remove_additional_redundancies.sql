-- Migration 007: Remove additional redundant and unused fields
-- This migration continues the cleanup started in 004, removing more redundancies discovered during thorough analysis

-- PART 1: Remove achievement tracking from PlayerStatistics (UserAchievements table handles this)
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "totalAchievementsUnlocked";
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "rareAchievementsUnlocked";

-- PART 2: Remove unused decision/contract tracking from PlayerStatistics
-- (These fields are not being populated by game logic)
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "totalDecisionsMade";
ALTER TABLE "PlayerStatistics" DROP COLUMN IF EXISTS "contractsSigned";

-- PART 3: Remove redundant fields from CareerHistories
-- achievementsEarned duplicates UserAchievements table
ALTER TABLE "CareerHistories" DROP COLUMN IF EXISTS "achievementsEarned";

-- finalStats JSONB duplicates the dedicated columns (peakCash, peakFame, etc.)
ALTER TABLE "CareerHistories" DROP COLUMN IF EXISTS "finalStats";

-- gameId was referencing non-existent Games table (already removed in migration 004, but ensuring cleanup)
ALTER TABLE "CareerHistories" DROP COLUMN IF EXISTS "gameId";

-- PART 4: Clean up vague/undefined fields
-- historicalData and majorEvents are poorly defined and not used
ALTER TABLE "CareerHistories" DROP COLUMN IF EXISTS "historicalData";
ALTER TABLE "CareerHistories" DROP COLUMN IF EXISTS "majorEvents";

-- PART 5: Remove per-module time tracking (over-engineered)
ALTER TABLE "LearningProgresses" DROP COLUMN IF EXISTS "timeSpentMinutes";

-- Add comments
COMMENT ON TABLE "PlayerStatistics" IS 'Optimized player statistics - all redundancies removed (2025)';
COMMENT ON TABLE "CareerHistories" IS 'Completed career records - cleaned of redundancies (2025)';
COMMENT ON TABLE "LearningProgresses" IS 'Learning module progress - simplified tracking (2025)';
