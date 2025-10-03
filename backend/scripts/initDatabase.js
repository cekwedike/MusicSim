const { sequelize } = require('../models');

async function initDatabase() {
  try {
    console.log('🔗 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    console.log('📋 Syncing database models...');
    
    // Sync models with force: false (won't drop existing tables)
    await sequelize.sync({ 
      force: false,  // Set to true to drop and recreate tables (USE WITH CAUTION!)
      alter: false   // Set to true to alter existing tables to match models
    });
    
    console.log('✅ Database models synced successfully.');
    
    // List all created tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📊 Created tables:', tables);
    
    console.log('🎉 Database initialization complete!');
    console.log('');
    console.log('Tables created:');
    console.log('- Users: User accounts and authentication');
    console.log('- GameSaves: Game state storage');  
    console.log('- LearningProgresses: Learning module tracking');
    console.log('- CareerHistories: Completed game careers');
    console.log('- PlayerStatistics: Global player analytics');
    console.log('');
    console.log('You can now start the server with: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    console.log('');
    console.log('Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env file');
    console.log('3. Create the database: createdb musicsim');
    console.log('4. Verify PostgreSQL credentials');
    
    process.exit(1);
  }
}

// Run the initialization
console.log('🚀 Starting MusicSim Database Initialization...');
console.log('');
initDatabase();