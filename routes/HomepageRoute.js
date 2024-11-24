const express = require('express');
const { getHomepageData } = require('../controller/HomepageController');

const router = express.Router();

router.route('/').get(getHomepageData); 

module.exports = router; 



