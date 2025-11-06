const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Helper function to generate username from display name
// "John Doe" -> "JohnDoe_4729"
const generateUsernameFromName = (displayName) => {
  // Remove special characters and split by spaces
  const cleanName = displayName.replace(/[^a-zA-Z\s]/g, '');
  const words = cleanName.split(/\s+/).filter(word => word.length > 0);

  // Convert to PascalCase (capitalize first letter of each word)
  const pascalCase = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Generate 4 random digits
  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  return `${pascalCase}_${randomDigits}`;
};

// Helper function to ensure username is unique
const generateUniqueUsername = async (displayName) => {
  let username = generateUsernameFromName(displayName);
  let attempts = 0;
  const maxAttempts = 10;

  // Keep trying until we find a unique username
  while (attempts < maxAttempts) {
    const existingUser = await User.findOne({ where: { username } });
    if (!existingUser) {
      return username;
    }
    // Generate a new one with different random digits
    username = generateUsernameFromName(displayName);
    attempts++;
  }

  // Fallback: use email prefix with timestamp if all attempts fail
  return `user_${Date.now()}`;
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          // User exists, update last login
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Check if user exists with this email (to link accounts)
        user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.authProvider = 'google';
          user.lastLogin = new Date();

          // Update profile image if not set
          if (!user.profileImage && profile.photos && profile.photos.length > 0) {
            user.profileImage = profile.photos[0].value;
          }

          // Update display name if not set
          if (!user.displayName) {
            user.displayName = profile.displayName;
          }

          await user.save();
          return done(null, user);
        }

        // Generate unique username from display name
        const username = await generateUniqueUsername(profile.displayName);

        // Create new user from Google profile
        const newUser = await User.create({
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: 'google',
          username: username,
          displayName: profile.displayName,
          profileImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
          lastLogin: new Date(),
          isActive: true
        });

        // Create associated PlayerStatistics record
        const PlayerStatistics = require('../models/PlayerStatistics');
        await PlayerStatistics.create({
          userId: newUser.id
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
