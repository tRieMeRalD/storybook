// Bring in modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');

// Load user model
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Load routes and keys
const auth = require('./routes/auth');
const keys = require('./config/keys');
const index = require('./routes/index');

// Mongoose map global promise
mongoose.Promise = global.Promise;

// Connect mongoose
mongoose.connect(keys.mongoURI, {
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Start app
const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

/* Goes above the /auth */
// CookieParser and express session
app.use(cookieParser());
app.use(session({
    // Setting cookie objects
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Set global var for user information
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Use routes
app.use('/', index);
app.use('/auth', auth);

// Connecting to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
