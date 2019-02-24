// Bring in modules
const express = require('express');
const mongoose = require('mongoose');

// Start app
const app = express();

// Index route
app.get('/', (req, res) => {
    res.send('yea');
});

// Connecting to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
