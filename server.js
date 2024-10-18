require('dotenv').config();
const express = require('express');
// const bodyParser = require('body-parser');
const mongodb = require('./database/databaseController.js');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const GitHubStrategy = require('passport-github2').Strategy;

const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:4000/github/callback';

console.log("Callback URL: ", process.env.CALLBACK_URL);

// Express API Setup
const app = express();
app.use(express.json());
// app.use(bodyParser.json());
const port = process.env.PORT || 4000;

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use('/', require('./routers/authRouter.js'));
app.use('/cars', require('./routers/carsRouter.js'));
app.use('/api-docs', require('./routers/swaggerRouter.js'));

const githubstrag = new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        console.log('GitHub profile:', profile);
        return done(null, profile);
    }
);

console.log(githubstrag);

passport.use(githubstrag);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => { console.log(`Running on port ${port}`); });
    }
});
