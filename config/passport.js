// Brining files and modules
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

// Load user model
const User = mongoose.model('users');

// Exports and takes in passport object
module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true // Very true to avoid heroku errors
        }, (accessToken, refreshToken, profile, done) => {
            /* For dev purposes
                console.log(accessToken);
                console.log(profile)
            */

            // Removing the sizing in the URL '?sz=50'
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            
            // Preparing user object to put into db
            const newUser = {
                // Getting user info
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName, 
                email: profile.emails[0].value,
                image: image
            }

            // Checking if user exists to prevent multiple logging of user
            User.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                    // No error, and pass user ~ Return user 
                    done(null, user)
                } else {
                    // Creates new user 
                    new User(newUser).save()
                        .then(user => done(null, user));
                }
            })
        })
    );

    // Passport security
    passport.serializeUser((user, done) => {
        // Error is null and passes the user id
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // Finds user by id and if found passes no error and passes user
        User.findById(id).then(user => done(null, user));
    });
}

