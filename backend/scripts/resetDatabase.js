const { sequelize } = require('../models');

async function resetDatabase() {
  try {
    console.log('⚠️  WARNING: This will delete ALL data in the database!');
    console.log('🔗 Connecting to database...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    console.log('🗑️  Dropping all tables...');
    
    // Force sync with force: true will drop and recreate all tables
    await sequelize.sync({ force: true });
    
    console.log('✅ All tables dropped and recreated successfully.');
    
    // List all tables to confirm
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📊 Fresh tables created:', tables);
    
    console.log('🎉 Database reset complete!');
    console.log('');
    console.log('Fresh database schema ready:');
    console.log('- Users: User accounts and authentication');
    console.log('- GameSaves: Game state storage');  
    console.log('- LearningProgresses: Learning module tracking');
    console.log('- CareerHistories: Completed game careers');
    console.log('- PlayerStatistics: Global player analytics');
    console.log('');
    console.log('All previous data has been permanently deleted.');
    console.log('You can now start the server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    console.log('');
    console.log('Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env file');
    console.log('3. Ensure you have proper database permissions');
    
    process.exit(1);
  }
}

// Confirmation prompt simulation (in real usage, you might want to add readline)
console.log('🚀 Starting MusicSim Database Reset...');
console.log('⚠️  This will permanently delete all data!');
console.log('');

// Run the reset
resetDatabase();