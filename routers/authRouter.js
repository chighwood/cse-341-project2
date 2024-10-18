const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware/authController.js')

// Home Route after Login
router.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

// GitHub Login route
router.get('/login', passport.authenticate('github'), (req, res) => {
    console.log(res);
});

// Github Authentication Callback
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false
}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
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

