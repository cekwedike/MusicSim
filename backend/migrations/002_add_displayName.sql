-- Migration: Add displayName column to Users table
-- Date: 2025-01-09
-- Description: Add displayName field to support separate display name from username
--              Username: unique identifier for login (e.g., "john_doe123")
--              DisplayName: friendly name shown in UI (e.g., "DJ John" or "John Doe")

-- Add displayName column to Users table
ALTER TABLE "Users"
ADD COLUMN IF NOT EXISTS "displayName" VARCHAR(100);

-- Set displayName to username for existing users (default behavior)
UPDATE "Users"
SET "displayName" = username
WHERE "displayName" IS NULL AND username IS NOT NULL;

-- Add index for faster queries (optional but recommended)
CREATE INDEX IF NOT EXISTS "idx_users_displayName" ON "Users"("displayName");

-- Migration complete
SELECT 'Migration 002: displayName column added successfully' AS status;
