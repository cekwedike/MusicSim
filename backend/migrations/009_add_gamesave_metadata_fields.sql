-- Migration 009: Add metadata fields to GameSaves table
-- These fields are required by the model and game state routes

-- Add lastPlayedAt column (tracks when the save was last used)
ALTER TABLE "GameSaves" ADD COLUMN IF NOT EXISTS "lastPlayedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add currentDate column (stores the in-game date for quick access)
ALTER TABLE "GameSaves" ADD COLUMN IF NOT EXISTS "currentDate" TIMESTAMP WITH TIME ZONE;

-- Add startDate column (stores when the career started for quick access)
ALTER TABLE "GameSaves" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP WITH TIME ZONE;

-- Add playerStats column (stores player stats for quick access without parsing gameState JSONB)
ALTER TABLE "GameSaves" ADD COLUMN IF NOT EXISTS "playerStats" JSONB;

-- Update existing records to populate new fields from gameState
UPDATE "GameSaves"
SET
  "currentDate" = CASE
    WHEN "gameState"->>'currentDate' IS NOT NULL
    THEN ("gameState"->>'currentDate')::TIMESTAMP WITH TIME ZONE
    ELSE NOW()
  END,
  "startDate" = CASE
    WHEN "gameState"->>'startDate' IS NOT NULL
    THEN ("gameState"->>'startDate')::TIMESTAMP WITH TIME ZONE
    ELSE NOW()
  END,
  "playerStats" = CASE
    WHEN "gameState"->'playerStats' IS NOT NULL
    THEN "gameState"->'playerStats'
    ELSE '{"cash":0,"fame":0,"health":100,"stress":0,"creativity":50,"technique":50}'::JSONB
  END,
  "lastPlayedAt" = COALESCE("lastPlayedAt", "updatedAt", NOW())
WHERE "currentDate" IS NULL OR "startDate" IS NULL OR "playerStats" IS NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_gamesaves_lastplayedat" ON "GameSaves"("lastPlayedAt");
CREATE INDEX IF NOT EXISTS "idx_gamesaves_currentdate" ON "GameSaves"("currentDate");

-- Add comment
COMMENT ON COLUMN "GameSaves"."lastPlayedAt" IS 'Timestamp of when this save was last loaded/played';
COMMENT ON COLUMN "GameSaves"."currentDate" IS 'In-game current date for quick access without parsing gameState';
COMMENT ON COLUMN "GameSaves"."startDate" IS 'In-game start date for quick access without parsing gameState';
COMMENT ON COLUMN "GameSaves"."playerStats" IS 'Player stats snapshot for quick access without parsing gameState';
