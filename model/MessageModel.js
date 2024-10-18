const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: { type: String, required: true },
}, { timestamp: true })

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 