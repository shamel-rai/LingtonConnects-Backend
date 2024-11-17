const express = require('express');

const auth = require('../middleware/authMiddleware');

const { updateUserProfile, changePassword } = require('../controller/UserController');

const router = express.Router();

router.router('/profile').patch(auth, updateUserProfile);
router.route('/changePassword').patch(auth, changePassword); 


