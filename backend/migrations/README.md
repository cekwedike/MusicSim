# Database Migrations

This directory contains database migration scripts for MusicSim.

## How to Run Migrations

To run all pending migrations:

```bash
cd backend
npm run migrate
```

## Migration Files

### 001_remove_displayName.sql

**Date:** January 7, 2025
**Description:** Removes the `displayName` column from the Users table to simplify the user model. Now only `username` is used throughout the application.

**What it does:**
- Drops the `displayName` column from the `Users` table
- Simplifies user authentication to use only one name field

**Status:** ✅ Completed

## Creating New Migrations

1. Create a new SQL file in this directory with the naming pattern:
   ```
   NNN_description.sql
   ```
   Where NNN is a sequential number (e.g., 002, 003, etc.)

2. Write your SQL migration statements in the file

3. Update the `migrate.js` file if you need to run multiple migration files

4. Run `npm run migrate` to execute

## Rollback

Currently, there is no automatic rollback mechanism. To rollback a migration:

1. Manually create a rollback SQL script
2. Execute it using the same migration runner or manually via psql

## Best Practices

- Always test migrations on a development database first
- Back up your production database before running migrations
- Write migrations that can be run multiple times safely (idempotent)
- Use `IF EXISTS` and `IF NOT EXISTS` clauses when appropriate
- Document what each migration does and why

## Migration History

| ID  | File                           | Description                        | Date       | Status |
|-----|--------------------------------|------------------------------------|------------|--------|
| 001 | 001_remove_displayName.sql    | Remove displayName column          | 2025-01-07 | ✅     |
