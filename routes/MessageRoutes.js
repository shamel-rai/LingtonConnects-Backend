const express = require('express');
const Message = require('../model/MessageModel');
const auth = require('../middleware/authMiddleware'); 
const { getMessage, postMessage } = require('../controller/MessageController');

const router = express.Router();

router.route('/message').get(auth, getMessage);
router.route('/message').post(auth, postMessage)

module.exports = router; 