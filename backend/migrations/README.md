# Database Migrations for MusicSim

This directory contains all database migration scripts for MusicSim, providing version control for database schema changes and ensuring consistent database state across development, staging, and production environments.

Official website: https://www.musicsim.net

## Migration System Overview

The migration system manages progressive database schema changes while maintaining data integrity and providing rollback capabilities. Each migration represents a specific version of the database schema with clear documentation of changes made.

## Prerequisites

- PostgreSQL database server (version 12 or higher)
- Node.js environment with npm
- Appropriate database permissions for schema modifications
- Database backup capabilities for production environments

## Migration Execution

### Running All Pending Migrations

To execute all pending migrations in sequence:

```bash
cd backend
npm run migrate
```

### Running Specific Migrations

To run a specific migration file:

```bash
cd backend
node migrations/run-migration-[NUMBER].js
```

### Verification Commands

Verify migration status and database schema:

```bash
# Check database connection and schema
npm run db:status

# Validate migration completion
npm run db:verify

# Display current schema version
npm run db:version
```

## Migration File Documentation

### Migration 002: Add Display Name Support

**File:** `002_add_displayName.sql`
**Date:** January 15, 2025
**Status:** Completed

**Purpose:**
Adds support for user display names separate from usernames, allowing users to have public-facing names different from their login credentials.

**Changes Made:**
- Added `displayName` column to Users table (VARCHAR(100))
- Set default display name to username for existing users
- Added index on displayName for search optimization
- Updated user profile queries to include displayName

**Rollback Instructions:**
```sql
ALTER TABLE Users DROP COLUMN IF EXISTS displayName;
DROP INDEX IF EXISTS idx_users_display_name;
```

### Migration 003: Remove Password OAuth-Only Implementation

**File:** `003_remove_password_oauth_only.sql`
**Date:** January 20, 2025
**Status:** Completed

**Purpose:**
Transitions authentication system to OAuth-only approach, removing traditional password-based authentication to improve security and user experience.

**Changes Made:**
- Removed `password` column from Users table
- Removed `salt` column from Users table
- Added `oauthProvider` column (VARCHAR(50))
- Added `oauthId` column (VARCHAR(255))
- Updated authentication middleware
- Migrated existing users to OAuth system

**Rollback Instructions:**
```sql
ALTER TABLE Users ADD COLUMN password VARCHAR(255);
ALTER TABLE Users ADD COLUMN salt VARCHAR(255);
ALTER TABLE Users DROP COLUMN oauthProvider;
ALTER TABLE Users DROP COLUMN oauthId;
```

### Migration 004: Schema Optimization and Redundancy Removal

**File:** `004_optimize_schema_remove_redundancies.sql`
**Date:** February 1, 2025
**Status:** Completed

**Purpose:**
Optimizes database schema by removing redundant columns and improving query performance through better indexing strategies.

**Changes Made:**
- Removed duplicate timestamp columns
- Consolidated user statistics into single JSONB column
- Added composite indexes for frequently queried combinations
- Normalized game state storage structure
- Optimized foreign key relationships

### Migration 005: Achievement System Implementation

**File:** `005_create_achievements_system.sql`
**Date:** February 10, 2025
**Status:** Completed

**Purpose:**
Implements comprehensive achievement system with user progress tracking and unlockable content management.

**Changes Made:**
- Created `Achievements` table with achievement definitions
- Created `UserAchievements` junction table
- Added achievement progress tracking columns
- Implemented achievement unlock logic
- Added indexes for achievement queries

### Migration 006: Performance Index Optimization

**File:** `006_add_performance_indexes.sql`
**Date:** February 15, 2025
**Status:** Completed

**Purpose:**
Adds strategic database indexes to improve query performance for frequently accessed data patterns.

**Changes Made:**
- Added indexes on GameSaves table for user queries
- Optimized CareerHistory indexes for analytics
- Created composite indexes for learning progress
- Added partial indexes for active user sessions
- Implemented covering indexes for dashboard queries

### Migration 007: Additional Redundancy Cleanup

**File:** `007_remove_additional_redundancies.sql`
**Date:** February 20, 2025
**Status:** Completed

**Purpose:**
Continues schema optimization by removing additional redundant data structures and consolidating related information.

**Changes Made:**
- Consolidated player statistics storage
- Removed duplicate career tracking columns
- Optimized learning progress data structure
- Simplified authentication token storage

### Migration 008: Achievement Tables Cleanup

**File:** `008_remove_achievements_tables.sql`
**Date:** February 25, 2025
**Status:** Completed

**Purpose:**
Refactors achievement system to use application-level tracking instead of database tables for improved flexibility.

**Changes Made:**
- Removed separate Achievements table
- Consolidated achievement data into user statistics
- Simplified achievement unlock logic
- Improved achievement query performance

### Migration 009: Game Save Metadata Enhancement

**File:** `009_add_gamesave_metadata_fields.sql`
**Date:** March 1, 2025
**Status:** Completed

**Purpose:**
Enhances game save functionality with additional metadata fields for improved save management and user experience.

**Changes Made:**
- Added `difficulty` column to GameSaves table
- Added `artistName` column for save identification
- Added `gameWeek` column for progress tracking
- Added `totalCash` column for save previews
- Updated save loading queries

## Creating New Migrations

### Migration File Naming Convention

Use the following naming pattern for new migration files:
```
NNN_descriptive_name.sql
```

Where:
- `NNN` is a sequential three-digit number (e.g., 010, 011, 012)
- `descriptive_name` clearly indicates the purpose of the migration
- Use underscores to separate words

### Migration File Structure

Each migration file should include:

```sql
-- Migration: NNN - Description
-- Date: YYYY-MM-DD
-- Purpose: Detailed explanation of changes

-- Check if migration has already been applied
-- (Add appropriate checks to prevent duplicate execution)

-- Migration SQL statements
BEGIN;

-- Your migration code here

COMMIT;
```

### Migration Development Process

1. **Planning Phase**
   - Document the purpose and expected outcomes
   - Identify affected tables and relationships
   - Plan rollback strategy before implementation

2. **Development Phase**
   - Create migration file with appropriate naming
   - Write SQL statements with proper error handling
   - Include data validation and integrity checks

3. **Testing Phase**
   - Test migration on development database
   - Verify data integrity after migration
   - Test rollback procedures
   - Performance test on representative data volumes

4. **Documentation Phase**
   - Update migration history in this README
   - Document any manual steps required
   - Update API documentation if schema changes affect endpoints

5. **Deployment Phase**
   - Create database backup before migration
   - Execute migration in staging environment
   - Validate application functionality
   - Deploy to production with monitoring

## Rollback Procedures

### Automatic Rollback

Currently, the system does not provide automatic rollback functionality. Rollbacks must be performed manually using the documented rollback instructions for each migration.

### Manual Rollback Process

1. **Stop Application Services**
   ```bash
   # Stop backend server
   pm2 stop musicsim-backend
   ```

2. **Create Pre-Rollback Backup**
   ```bash
   pg_dump musicsim > pre_rollback_backup.sql
   ```

3. **Execute Rollback SQL**
   ```bash
   psql musicsim < rollback_migration_NNN.sql
   ```

4. **Verify Database State**
   ```bash
   npm run db:verify
   ```

5. **Restart Application Services**
   ```bash
   pm2 start musicsim-backend
   ```

## Best Practices and Guidelines

### Migration Safety

- **Always backup production databases** before applying migrations
- **Test migrations thoroughly** on development and staging environments
- **Write idempotent migrations** that can be safely run multiple times
- **Use transactions** to ensure atomicity of migration operations
- **Include proper error handling** to prevent partial migrations

### Data Integrity

- **Validate data consistency** before and after migrations
- **Use foreign key constraints** to maintain referential integrity
- **Implement data validation checks** within migration scripts
- **Consider data migration** for existing records when changing schemas

### Performance Considerations

- **Analyze query performance impact** of schema changes
- **Add indexes strategically** to support new query patterns
- **Consider migration execution time** for large datasets
- **Plan for minimal downtime** during production migrations

### Documentation Standards

- **Document all schema changes** with clear explanations
- **Include rollback instructions** for every migration
- **Update API documentation** when endpoints are affected
- **Maintain migration history** with status tracking

## Migration History Table

| Migration | File Name | Description | Date | Status | Rollback Available |
|-----------|-----------|-------------|------|--------|-----------------|
| 002 | `002_add_displayName.sql` | Add user display name support | 2025-01-15 | Completed | Yes |
| 003 | `003_remove_password_oauth_only.sql` | OAuth-only authentication | 2025-01-20 | Completed | Yes |
| 004 | `004_optimize_schema_remove_redundancies.sql` | Schema optimization | 2025-02-01 | Completed | Partial |
| 005 | `005_create_achievements_system.sql` | Achievement system implementation | 2025-02-10 | Completed | Yes |
| 006 | `006_add_performance_indexes.sql` | Performance index optimization | 2025-02-15 | Completed | Yes |
| 007 | `007_remove_additional_redundancies.sql` | Additional redundancy cleanup | 2025-02-20 | Completed | Partial |
| 008 | `008_remove_achievements_tables.sql` | Achievement tables cleanup | 2025-02-25 | Completed | No |
| 009 | `009_add_gamesave_metadata_fields.sql` | Game save metadata enhancement | 2025-03-01 | Completed | Yes |

## Database Schema Versioning

The current database schema version can be determined by checking the highest numbered migration that has been successfully applied. The application includes schema version checking to ensure compatibility between the codebase and database structure.

## Troubleshooting Common Issues

### Migration Fails to Execute

1. **Check Database Connection**: Verify database connectivity and permissions
2. **Review Migration Logs**: Examine error messages for specific failure points
3. **Validate SQL Syntax**: Test migration SQL in development environment
4. **Check Dependencies**: Ensure all prerequisite migrations have been applied

### Data Inconsistency After Migration

1. **Run Data Validation Scripts**: Check data integrity using validation queries
2. **Compare with Backup**: Identify discrepancies from pre-migration state
3. **Review Migration Logic**: Analyze migration code for logical errors
4. **Consider Rollback**: If issues persist, rollback and investigate

### Performance Degradation

1. **Analyze Query Plans**: Check if new schema affects query performance
2. **Review Index Usage**: Ensure appropriate indexes are being utilized
3. **Monitor Resource Usage**: Check database resource consumption
4. **Optimize Queries**: Update application queries to leverage schema changes

## Support and Contact Information

For migration-related issues and support:
- **GitHub Issues**: [MusicSim Repository](https://github.com/cekwedike/MusicSim/issues)
- **Documentation**: Database schema documentation in `/docs/database/`
- **Emergency Contact**: For critical production issues requiring immediate attention
