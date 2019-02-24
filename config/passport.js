// Brining files and modules
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Exports and takes in passport object
module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true // Very true to avoid heroku errors
        }, (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log(profile)
        })
    )
}

