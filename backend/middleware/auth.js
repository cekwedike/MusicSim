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

    // Find user in our database
    const user = await User.findByPk(supabaseUser.id);

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
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = authMiddleware;
