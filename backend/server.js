// MusicSim Backend Server
// This is a placeholder for potential backend functionality

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'MusicSim Backend is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`MusicSim Backend running on port ${PORT}`);
});

module.exports = app;