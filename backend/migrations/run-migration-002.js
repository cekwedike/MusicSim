const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('Starting database migration 002 (add displayName)...');

    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Read the SQL migration file
    const migrationFile = path.join(__dirname, '002_add_displayName.sql');
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
      console.log(`[${i + 1}/${statements.length}] Executing: ${statement.substring(0, 60)}...`);

      if (statement.toLowerCase().includes('select')) {
        // For SELECT statements, show the result
        const [result] = await sequelize.query(statement);
        console.log('Result:', result);
      } else {
        // For DDL statements, just execute
        await sequelize.query(statement);
        console.log('✓ Executed successfully');
      }
      console.log('');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('The displayName column has been added to the Users table.');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
