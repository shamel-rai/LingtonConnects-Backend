const express = require('express');
const router = express.Router();
const authe = require('../middleware/authMiddleware')
const { createNotification, getNotification } = require('../controller/NotificationController');


module.exports = (io) => {
    router.post('/notify', authe, (req, res) => createNotification(req, res, io));

    router.get('/notify/:userId', authe, getNotification);

    return router;
}