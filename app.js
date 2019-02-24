// Bring in modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth');

// Start app
const app = express();

// Use routes
app.use('/auth', auth);

// Index route
app.get('/', (req, res) => {
    res.send('yea');
});

// Connecting to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
