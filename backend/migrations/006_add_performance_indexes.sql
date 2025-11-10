-- Migration 006: Add database indexes for improved query performance
-- These indexes optimize common queries and foreign key lookups

-- GameSaves indexes
CREATE INDEX IF NOT EXISTS "idx_gamesaves_userid" ON "GameSaves"("userId");
CREATE INDEX IF NOT EXISTS "idx_gamesaves_lastplayedat" ON "GameSaves"("lastPlayedAt");
CREATE INDEX IF NOT EXISTS "idx_gamesaves_isactive" ON "GameSaves"("isActive");

-- CareerHistory indexes
CREATE INDEX IF NOT EXISTS "idx_careerhistory_userid" ON "CareerHistories"("userId");
CREATE INDEX IF NOT EXISTS "idx_careerhistory_outcome" ON "CareerHistories"("outcome");
CREATE INDEX IF NOT EXISTS "idx_careerhistory_difficulty" ON "CareerHistories"("difficulty");
CREATE INDEX IF NOT EXISTS "idx_careerhistory_createdat" ON "CareerHistories"("createdAt");

-- Composite index for leaderboard queries (top players by peak metrics)
CREATE INDEX IF NOT EXISTS "idx_careerhistory_leaderboard" ON "CareerHistories"("peakCash" DESC, "peakFame" DESC);

-- LearningProgress indexes
CREATE INDEX IF NOT EXISTS "idx_learningprogress_userid" ON "LearningProgress"("userId");
CREATE INDEX IF NOT EXISTS "idx_learningprogress_completed" ON "LearningProgress"("completed");
CREATE INDEX IF NOT EXISTS "idx_learningprogress_category" ON "LearningProgress"("category");

-- PlayerStatistics index
CREATE INDEX IF NOT EXISTS "idx_playerstats_userid" ON "PlayerStatistics"("userId");

-- User indexes
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "Users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "Users"("username");
CREATE INDEX IF NOT EXISTS "idx_users_isactive" ON "Users"("isActive");

COMMENT ON INDEX "idx_careerhistory_leaderboard" IS 'Optimizes leaderboard queries for top performers';
