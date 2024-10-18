const router = require('express').Router();
const passport = require('passport');

// Include the cars/swagger route
router.use('/cars', require('./cars'));
router.use('/', require('./swagger'));


// Home route
router.get('/', (req, res) => {
    res.send('Hello World');
});

// GitHub Login route
router.get('/login', passport.authenticate('github'), (req, res) => {});

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

