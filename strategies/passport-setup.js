// passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { saveUser, getUser}= require("../utils/googleUser")
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    // console.log('Profile:', profile); // Log the profile returned by Google
    const { id, displayName, emails, _json } = profile;

    // Extract the profile picture URL if available
    const photo = _json.picture || null; 

    // Use a placeholder password for Google auth
    const password = 'google-auth';

    // Update or create user with the additional fields
    const user = await prisma.user.upsert({
      where: { email: emails[0].value },
      update: { 
        userName: displayName,
        password,
        photo
      },
      create: {
        userName: displayName,
        email: emails[0].value,
        password, // Using 'google-auth' or an actual hashed password might be appropriate
        role: 'user',
        photo
      }
    });
    // req.user = user;
    done(null, user);
  }
));

// Called when the user is authenticated
passport.serializeUser((user, done) => {

  done(null, user.id); // Serialize the user ID into the session
});

// Called on subsequent requests
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user ID:", id);
    const user = await prisma.user.findUnique({ where: { id } });
    console.log("Deserialized user:", user);
  saveUser(user)
    done(null, user); // Attach user object to req.user
  } catch (error) {
    done(error);
  }
});


