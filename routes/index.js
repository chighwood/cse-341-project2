const router = require('express').Router();

router.use('/cars', require('./cars'));

module.exports = router;

