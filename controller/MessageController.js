const Message = require('../model/MessageModel');

exports.chatController = (socket) => {
    console.log('User Connected', socket.id);

    Message.find().sort({ timestamp: -1 }).limit(10).exec((error, Message) => { //will load last 10 messages for the new connectd user
        if (error) return console.error(error);
        socket.emit('load message', Message.reverse());
    });

    socket.on('chat message', async (msg) => {
        try {
            const { message, sender } = msg
            const newMessage = new Message({ message: msg, sender });
            await newMessage.save();

            socket.broadcast.emit('chat message', newMessage); // this will broadcast to all connected users
        } catch (error) {
            console.error('Error saving message: ', error)
        }
    })

    socket.on('disconnect', () => {
        console.log('User has disconnected:', socket.id)
    })
}

exports.getMessage = async (req, res) => {
    try {
        const message = await Message.find().sort({ timestamp: -1 }).limit(50);
        res.json(message);
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

exports.postMessage = async (req, res) => {
    const { message } = req.body;

    console.log("User ID from request:", req.user);
    console.log("Message to be sent:", message);

    const sender = req.user ? req.user.id : null;

    if (!sender || !message) {
        return res.status(400).json({ error: 'Sender and message are required' })
    }
    try {
        const newMessage = new Message({
            sender, message
        })
        await newMessage.save();
        res.status(201).json({ message: newMessage })
    } catch (error) {
        res.status(500).send({ error: error.message })
    }

}

