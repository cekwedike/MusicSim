-- Migration: Remove password column and make authentication OAuth-only
-- Date: 2025-01-10
-- Description: Removes password field from Users table as we're moving to OAuth-only authentication

-- Remove password column from Users table
ALTER TABLE "Users" DROP COLUMN IF EXISTS "password";

-- Update authProvider default to 'google' (OAuth only)
ALTER TABLE "Users" ALTER COLUMN "authProvider" SET DEFAULT 'google';

-- Add comment to table
COMMENT ON TABLE "Users" IS 'User accounts - OAuth authentication only (Google)';
