// Simple test to verify route structure and imports
const express = require('express');

console.log('Testing route imports...');

try {
  // Test gameState routes
  const gameStateRoutes = require('./routes/gameState');
  console.log('Game state routes imported successfully');
  
  // Test careerHistory routes  
  const careerHistoryRoutes = require('./routes/careerHistory');
  console.log('Career history routes imported successfully');
  
  // Test auth middleware
  const authMiddleware = require('./middleware/auth');
  console.log('Auth middleware imported successfully');
  
  // Test models (without database connection)
  console.log('All route dependencies loaded successfully');
  
  // Create a mock app to test route mounting
  const app = express();
  app.use('/api/game', gameStateRoutes);
  app.use('/api/career', careerHistoryRoutes);
  
  console.log('Routes mounted successfully on mock app');
  console.log('API structure validation complete');
  
} catch (error) {
  console.error('Error testing routes:', error.message);
  process.exit(1);
}