const express = require('express');

const {status} = require('../controller/StatusController')

const router = express.Router();

router.route('/status').get(status)


module.exports = router; 