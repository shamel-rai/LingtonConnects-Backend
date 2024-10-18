const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}, // ID of the user receiving the notification 
    message: String,
    type: String,
    read: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now }
})


const Notification = mongoose.model('Notification', notificationSchema);


module.exports = Notification; 