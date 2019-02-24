const express = require('express');
const passport = require('passport');
const router = express.Router();

// Get auth routes
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// Google auth callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard');
});

// Check auth is true
router.get('/verify', (req, res) => {
    if (req.user) {
        console.log(req.user);
    } else {
        console.log('Not auth');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    // Logouts and redirects
    req.logout();
    res.redirect('/');
});

module.exports = router;