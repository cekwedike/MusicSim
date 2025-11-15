const supabase = require('../config/supabase');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token with Supabase
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Find user in our database with retry logic for connection issues
    let user = null;
    let retries = 3;
    let lastError = null;

    while (retries > 0 && !user) {
      try {
        user = await User.findByPk(supabaseUser.id);
        break; // Success, exit loop
      } catch (dbError) {
        lastError = dbError;
        // Check if it's a connection error
        if (dbError.name === 'SequelizeConnectionRefusedError' ||
            dbError.name === 'SequelizeConnectionError' ||
            dbError.parent?.code === 'ECONNREFUSED') {
          retries--;
          if (retries > 0) {
            console.warn(`Database connection failed, retrying... (${3 - retries}/3)`);
            // Wait 1 second before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } else {
          // Not a connection error, throw it
          throw dbError;
        }
      }
    }

    // If all retries failed, return service unavailable
    if (!user && lastError) {
      console.error('Database connection failed after 3 retries:', lastError.message);
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again in a moment.',
        error: 'SERVICE_UNAVAILABLE'
      });
    }

    if (!user) {
      // User authenticated with Supabase but no profile in our DB yet
      // This can happen right after Google OAuth - create profile on the fly
      console.log('User authenticated but no profile found, user ID:', supabaseUser.id);

      // Attach minimal user info to request for profile creation
      req.supabaseUser = supabaseUser;
      req.userId = supabaseUser.id;
      req.user = null; // No profile yet

      return next();
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.supabaseUser = supabaseUser; // Also attach Supabase user for metadata

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    // More specific error handling
    if (error.name === 'SequelizeConnectionRefusedError' ||
        error.name === 'SequelizeConnectionError' ||
        error.parent?.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again in a moment.',
        error: 'SERVICE_UNAVAILABLE'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = authMiddleware;
