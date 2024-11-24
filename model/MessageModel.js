const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: string,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 