const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Starting database migrations...');

    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established.\n');

    // List of migrations to run in order
    const migrations = [
      '007_remove_additional_redundancies.sql',
      '008_remove_achievements_tables.sql',
      '009_add_gamesave_metadata_fields.sql'
    ];

    for (const migrationFileName of migrations) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`Running migration: ${migrationFileName}`);
      console.log('='.repeat(60));

      const migrationFile = path.join(__dirname, migrationFileName);
      const sql = fs.readFileSync(migrationFile, 'utf8');

      // Remove comments and split by semicolon
      const cleanedSql = sql
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n');

      const statements = cleanedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      console.log(`Executing ${statements.length} SQL statements...\n`);

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        const preview = statement.substring(0, 80).replace(/\s+/g, ' ');
        console.log(`[${i + 1}/${statements.length}] ${preview}...`);

        try {
          if (statement.toLowerCase().includes('select')) {
            // For SELECT statements, show the result
            const [result] = await sequelize.query(statement);
            console.log('Result:', result.length > 0 ? `${result.length} rows` : 'No rows');
          } else {
            // For DDL statements, just execute
            await sequelize.query(statement);
            console.log('✓ Executed successfully');
          }
        } catch (error) {
          // Continue on errors like "column does not exist" (already migrated)
          if (error.message.includes('does not exist') || error.message.includes('already exists')) {
            console.log('⚠ Skipped (already applied)');
          } else {
            throw error;
          }
        }
      }

      console.log(`\n✅ Completed: ${migrationFileName}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL MIGRATIONS COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\nChanges applied:');
    console.log('  • Removed ALL redundant fields from PlayerStatistics');
    console.log('  • Removed redundant/vague fields from CareerHistories');
    console.log('  • Removed per-module time tracking from LearningProgresses');
    console.log('  • Removed Achievements/UserAchievements tables');
    console.log('  • Achievements now managed in code (constants/achievements.js)');
    console.log('  • Added metadata fields to GameSaves (lastPlayedAt, currentDate, startDate, playerStats)');
    console.log('\nDatabase is now fully optimized and ready!');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
