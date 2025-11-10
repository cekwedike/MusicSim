-- Migration 005: Create proper Achievements system
-- Currently achievements are just tracked as counts, but there's no table defining what achievements exist

-- Create Achievements table
CREATE TABLE IF NOT EXISTS "Achievements" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" VARCHAR(50) UNIQUE NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "iconUrl" TEXT,
  "category" VARCHAR(50), -- career, learning, financial, social, etc.
  "rarity" VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
  "unlockCondition" JSONB, -- Stores the conditions needed to unlock
  "pointsValue" INTEGER DEFAULT 10, -- Points awarded for unlocking
  "isHidden" BOOLEAN DEFAULT false, -- Secret achievements
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create UserAchievements junction table (tracks which users unlocked which achievements)
CREATE TABLE IF NOT EXISTS "UserAchievements" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
  "achievementId" UUID NOT NULL REFERENCES "Achievements"(id) ON DELETE CASCADE,
  "unlockedAt" TIMESTAMP DEFAULT NOW(),
  "progress" JSONB, -- For multi-step achievements (e.g., "Win 10 games": {current: 5, target: 10})
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  UNIQUE("userId", "achievementId")
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "idx_userachievements_userid" ON "UserAchievements"("userId");
CREATE INDEX IF NOT EXISTS "idx_userachievements_achievementid" ON "UserAchievements"("achievementId");
CREATE INDEX IF NOT EXISTS "idx_userachievements_unlockedat" ON "UserAchievements"("unlockedAt");

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS "idx_achievements_category" ON "Achievements"("category");
CREATE INDEX IF NOT EXISTS "idx_achievements_rarity" ON "Achievements"("rarity");

-- Insert some starter achievements
INSERT INTO "Achievements" ("code", "name", "description", "category", "rarity", "pointsValue") VALUES
('first_career', 'First Steps', 'Complete your first career', 'career', 'common', 10),
('first_million', 'Millionaire', 'Earn $1,000,000 in a single career', 'financial', 'rare', 50),
('fame_100', 'Rising Star', 'Reach 100 fame points', 'career', 'common', 25),
('fame_500', 'Superstar', 'Reach 500 fame points', 'career', 'epic', 100),
('week_52', 'Year One', 'Survive 52 weeks in a career', 'career', 'rare', 50),
('week_104', 'Two Year Legend', 'Survive 104 weeks in a career', 'career', 'epic', 150),
('first_module', 'Student', 'Complete your first learning module', 'learning', 'common', 15),
('all_modules', 'Scholar', 'Complete all learning modules', 'learning', 'legendary', 200),
('quiz_perfect', 'Perfect Score', 'Get 100% on a quiz', 'learning', 'rare', 30),
('career_hard', 'Hard Mode Victor', 'Complete a career on Hard difficulty', 'career', 'epic', 100),
('career_expert', 'Expert Champion', 'Complete a career on Expert difficulty', 'career', 'legendary', 250);

COMMENT ON TABLE "Achievements" IS 'Defines all available achievements in the game';
COMMENT ON TABLE "UserAchievements" IS 'Tracks which achievements each user has unlocked';
