const router = require('express').Router();
const data = require('./data');

router.use('/data', data.router);

module.exports = router;