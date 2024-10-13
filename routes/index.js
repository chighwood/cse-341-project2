const router = require('express').Router();
const passport = require('passport');

// Include the cars route
router.use('/cars', require('./cars'));

// Home route
router.get('/', (req, res) => {
    res.send('Hello World');
});

// GitHub Login route
router.get('/login', (req, res, next) => {
    console.log('Login request received');
    passport.authenticate('github')(req, res, next);
});

// GitHub Callback route
router.get('/github/callback', (req, res, next) => {
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
            req.session.user = user; // Save user in session
            res.redirect('/'); // Redirect to home or a specific page after login
        });
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/'); // Redirect to home after logout
    });
});

module.exports = router;

