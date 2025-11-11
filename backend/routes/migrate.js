const express = require('express');
const router = express.Router();
const runMigration = require('../migrations/migrate');

/**
 * @route   POST /api/migrate/run
 * @desc    Run database migrations (admin only - requires secret key)
 * @access  Public (but requires MIGRATION_SECRET)
 */
router.post('/run', async (req, res) => {
  try {
    // Simple secret-based authentication
    const { secret } = req.body;
    const MIGRATION_SECRET = process.env.MIGRATION_SECRET || 'change-me-in-production';

    if (secret !== MIGRATION_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Invalid migration secret'
      });
    }

    console.log('[/api/migrate/run] Migration requested via API');

    // Run migrations
    await runMigration();

    res.json({
      success: true,
      message: 'Migrations completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[/api/migrate/run] Migration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/migrate/status
 * @desc    Check migration status and database schema
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const { sequelize } = require('../models');

    // Test database connection
    await sequelize.authenticate();

    // Check if GameSaves table has the required columns
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'GameSaves'
      ORDER BY ordinal_position;
    `);

    const hasLastPlayedAt = results.some(col => col.column_name === 'lastPlayedAt');
    const hasCurrentDate = results.some(col => col.column_name === 'currentDate');
    const hasStartDate = results.some(col => col.column_name === 'startDate');
    const hasPlayerStats = results.some(col => col.column_name === 'playerStats');

    const migrationNeeded = !hasLastPlayedAt || !hasCurrentDate || !hasStartDate || !hasPlayerStats;

    res.json({
      success: true,
      database: {
        connected: true,
        tablesChecked: 'GameSaves'
      },
      schema: {
        columns: results,
        requiredColumns: {
          lastPlayedAt: hasLastPlayedAt ? '✓' : '✗ MISSING',
          currentDate: hasCurrentDate ? '✓' : '✗ MISSING',
          startDate: hasStartDate ? '✓' : '✗ MISSING',
          playerStats: hasPlayerStats ? '✓' : '✗ MISSING'
        },
        migrationNeeded: migrationNeeded
      },
      message: migrationNeeded
        ? 'Migration needed - missing required columns'
        : 'Database schema is up to date'
    });
  } catch (error) {
    console.error('[/api/migrate/status] Error checking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check migration status',
      error: error.message
    });
  }
});

module.exports = router;
