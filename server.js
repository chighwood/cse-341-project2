require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./database/database');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const GitHubStrategy = require('passport-github2').Strategy;
const MongoDBStore = require('connect-mongodb-session')(session);


const mongoDBUri = process.env.MONGODB_URL;

const store = new MongoDBStore({
    uri: mongoDBUri,
    collection: 'sessions',
});

store.on('error', function (error) {
    console.error('Session store error:', error);
});

const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:4000/github/callback';

console.log("Callback URL: ", process.env.CALLBACK_URL);

const app = express();
app.use(express.json());
const port = process.env.PORT || 4000;

app.use(bodyParser.json())
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
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
    origin: 'http://localhost:4000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use('/', require('./routes'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
},
    function (accessToken, refreshToken, profile, done) {
        console.log('GitHub profile:', profile);
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/auth/github', (req, res) => {
    passport.authenticate('github')(req, res);
});



app.get('/github/callback', (req, res, next) => {
    console.log('Callback reached');
    passport.authenticate('github', (err, user, info) => {
        if (err) {
            console.error('Authentication Error:', err);
            return res.redirect('/');
        }
        if (!user) {
            console.error('Authentication failed:', info);
            return res.redirect('/');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login Error:', err);
                return res.redirect('/');
            }
            req.session.user = user;
            console.log('User logged in:', req.session.user);
            return res.redirect('/');
        });
    })(req, res, next);
});

app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
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


