const router = require('express').Router();
const passport = require('passport');

router.use('/cars', require('./cars'));

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.get('/login', passport.authenticate('github'));

router.get('/logout', (req, res, next) => {
    req.logout()
        .then(() => res.redirect('/'))
        .catch(next);
});


module.exports = router;

