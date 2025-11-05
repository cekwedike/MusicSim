const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

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

        // Create new user from Google profile
        const newUser = await User.create({
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: 'google',
          username: profile.emails[0].value.split('@')[0] + '_' + Date.now(), // Generate unique username
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
