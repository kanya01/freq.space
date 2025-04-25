// backend/config/passport.js
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path if needed
require('dotenv').config(); // Ensure JWT_SECRET is loaded

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extracts token from "Bearer <token>" header
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                // The payload contains the 'id' we put in when signing the token
                const user = await User.findById(jwt_payload.id);

                if (user) {
                    // If user found, call done with null error and the user object
                    return done(null, user);
                } else {
                    // If user not found
                    return done(null, false);
                    // Or you could create a new account? (Depends on strategy)
                }
            } catch (error) {
                console.error('Passport Strategy Error:', error);
                return done(error, false); // Pass error to done callback
            }
        })
    );
};