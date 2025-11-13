-- Migration: 010 - Add Username Uniqueness Constraint
-- Date: 2025-11-13
-- Purpose: Ensure username uniqueness across all users regardless of email

-- Check if constraint already exists and add if needed
-- Note: Using separate statements for better compatibility

-- First, resolve any existing duplicate usernames
UPDATE "Users" 
SET username = CONCAT(username, '_', id::text)
WHERE id IN (
    SELECT id FROM (
        SELECT id, username,
               ROW_NUMBER() OVER (PARTITION BY username ORDER BY "createdAt") as rn
        FROM "Users"
    ) t WHERE rn > 1
);

-- Add unique constraint on username (will succeed if not exists)
ALTER TABLE "Users" ADD CONSTRAINT users_username_unique UNIQUE (username);

-- Add index on username for performance
CREATE INDEX IF NOT EXISTS idx_users_username_unique ON "Users" (username);

-- Add comments for documentation
COMMENT ON CONSTRAINT users_username_unique ON "Users" IS 'Ensures username uniqueness across all users regardless of email (2025)';
