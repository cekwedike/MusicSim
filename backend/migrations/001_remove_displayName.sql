-- Migration: Remove displayName column from Users table
-- Date: 2025-01-07
-- Description: Simplify user model by using only username (no separate displayName)

-- Drop the displayName column from Users table
ALTER TABLE "Users" DROP COLUMN IF EXISTS "displayName";

-- Optional: Update any NULL usernames with email prefix (safety measure)
-- UPDATE "Users"
-- SET username = SPLIT_PART(email, '@', 1)
-- WHERE username IS NULL;

-- Migration complete
SELECT 'Migration 001: displayName column removed successfully' AS status;
