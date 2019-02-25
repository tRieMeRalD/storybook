// Bring in modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Load models
require('./models/User');
require('./models/Story');

// Passport config
require('./config/passport')(passport);

// Load routes and keys
const auth = require('./routes/auth');
const keys = require('./config/keys');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Handlebars helpers (hbs)
const {
    truncate, 
    stripTags,
    formatDate,
    select
} = require('./helpers/hbs');

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

// BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Handlebars middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select
    },
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

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

// Connecting to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
