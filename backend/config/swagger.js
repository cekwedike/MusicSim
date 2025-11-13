const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MusicSim API',
    version: '1.0.0',
    description: 'Backend API for MusicSim - A Music Business Simulation',
    contact: {
      name: 'MusicSim Development Team',
      email: 'support@musicsim.dev'
    }
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://musicsim-backend.onrender.com'
        : 'http://localhost:3001',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
    },
    {
      url: 'http://localhost:3001',
      description: 'Local development server'
    },
    {
      url: 'https://musicsim-backend.onrender.com',
      description: 'Production server (Render)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique user identifier'
          },
          username: {
            type: 'string',
            description: 'Username'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          lastLogin: {
            type: 'string',
            format: 'date-time',
            description: 'Last login timestamp'
          }
        }
      },
      GameState: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['start', 'setup', 'playing', 'gameOver', 'loading'],
            description: 'Current game status'
          },
          artistName: {
            type: 'string',
            description: 'Player\'s artist name'
          },
          artistGenre: {
            type: 'string',
            description: 'Musical genre'
          },
          difficulty: {
            type: 'string',
            enum: ['easy', 'realistic', 'hard'],
            description: 'Game difficulty level'
          },
          playerStats: {
            type: 'object',
            properties: {
              cash: { type: 'number' },
              fame: { type: 'number' },
              wellBeing: { type: 'number' },
              careerProgress: { type: 'number' },
              hype: { type: 'number' }
            }
          },
          date: {
            type: 'object',
            properties: {
              week: { type: 'number' },
              month: { type: 'number' },
              year: { type: 'number' }
            }
          }
        }
      },
      GameSave: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Save file identifier'
          },
          slotName: {
            type: 'string',
            description: 'Save slot name'
          },
          artistName: {
            type: 'string',
            description: 'Artist name in the save'
          },
          genre: {
            type: 'string',
            description: 'Musical genre'
          },
          difficulty: {
            type: 'string',
            description: 'Game difficulty'
          },
          weeksPlayed: {
            type: 'number',
            description: 'Number of weeks played'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          },
          lastPlayedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful'
          },
          message: {
            type: 'string',
            description: 'Response message'
          },
          data: {
            type: 'object',
            description: 'Response data (varies by endpoint)'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            description: 'Error message'
          },
          error: {
            type: 'string',
            description: 'Technical error details'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './routes/*.js',
    './server.js'
  ], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;