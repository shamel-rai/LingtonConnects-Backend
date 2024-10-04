const express = require('express');

const { signup, login, signout } = require('../controller/AuthController')

const router = express.Router();

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/signout').post(signout)


module.exports = router; 