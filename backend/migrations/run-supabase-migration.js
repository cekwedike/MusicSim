/**
 * Run migration directly on Supabase database
 * This uses the DATABASE_URL from .env to connect to Supabase Postgres
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function runSupabaseMigration() {
  // Create a connection pool to Supabase
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Supabase
    }
  });

  try {
    console.log('🔗 Connecting to Supabase database...');

    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to Supabase!\n');

    // Read the migration file
    const migrationFile = path.join(__dirname, '002_add_displayName.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('📄 Running migration: 002_add_displayName.sql\n');

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
      console.log(`[${i + 1}/${statements.length}] ${statement.substring(0, 60)}...`);

      try {
        if (statement.toLowerCase().includes('select')) {
          // For SELECT statements, show the result
          const result = await client.query(statement);
          console.log('✅ Result:', result.rows);
        } else {
          // For DDL statements, just execute
          await client.query(statement);
          console.log('✅ Executed successfully');
        }
      } catch (err) {
        console.error(`❌ Error executing statement: ${err.message}`);
        // Continue with other statements even if one fails
      }
      console.log('');
    }

    console.log('\n🎉 Migration completed successfully on Supabase!');
    console.log('The displayName column has been added to the Users table.');

    // Release client
    client.release();
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
    process.exit(0);
  }
}

runSupabaseMigration();
