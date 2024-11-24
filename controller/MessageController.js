const Message = require('../model/MessageModel');

// exports.chatController = (socket) => {
//     console.log('User Connected', socket.id);

//     Message.find().sort({ timestamp: -1 }).limit(10).exec((error, Message) => { //will load last 10 messages for the new connectd user
//         if (error) return console.error(error);
//         socket.emit('load message', Message.reverse());
//     });

//     socket.on('chat message', async (msg) => {
//         if (!msg || !msg.message || !msg.sender) {
//             return console.error("Invalid message format");
//         }
//         try {
//             const newMessage = new Message({ message: msg.message, sender: msg.sender });
//             await newMessage.save();

//             socket.broadcast.emit('chat message', newMessage); // this will broadcast to all connected users
//         } catch (error) {
//             console.error('Error saving message: ', error)
//         }
//     })

//     socket.on('disconnect', () => {
//         console.log('User has disconnected:', socket.id)
//     })
// }

exports.chatController = (socket, io) => {
    console.log("User Connected: ", socket.id);

    //Join channel (group messaging)
    socket.io('Join Channel', (channel) => {
        socket.join(channel);
        console.log(`User ${socket.id} joined the channel : ${channel}`);
    })

    //Group message function
    socket.on('group message', async (data) => {
        const { channel, message, sender } = data;
        if (!channel || !message || !sender) return console.error("Invalid group message data")

        try {
            const newMessage = await Message.create({ message, sender, channel })
            io.to(channel).emit('group messsage', newMessage) // will send message to everyon in the channel
        } catch (error) {
            console.error('Error saving group message: ', error);
        }
    });

    //Personal dm
    socket.on("Personal message", async (data) => {
        const { sender, recipient, message } = data;
        if (!sender || !recipient || !message) return console.error("Invalid personal message data");

        const room = getRoomName(sender, recipient) // ensure consistence room names
        socket.join(room);

        try {
            const newMessage = await Message.create({ message, sender, recipient })
            io.to(room).emit('personal message', newMessage) //sends message in personal dm
        } catch (error) {
            console.error('Error saving personal message: ', error)
        }

    });
    socket.on('disconnect', () => {
        console.log('User Disconnected', scoket.id);
    })
}

const getRoomName = (userOne, userTwo) => {
    return userOne < userTwo ? `${userOne}_${userTwo}` : `${userTwo}_${userOne}`;
};


// exports.getMessage = async (req, res) => {
//     try {
//         //lean() improves performance by returning plain js objects instead of mongoose documents
//         const message = await Message.find().sort({ timestamp: -1 }).limit(20).lean().exec((err, message) => {
//             if (error) return console.error(error.message);
//             socket.emit('load message', message.reverse())
//         });
//         res.json(message);
//     } catch (error) {
//         res.status(500).send({ error: error.message })
//     }
// }

exports.getMessages = async (req, res, next) => {
    const { channel, userOne, userTwo } = req.query;
    try {
        let message;
        if (channel) {
            //fetch message from group channel
            message = await Message.find({ channel }).sort({ timestamp: -1 }).limit(50).lean(); //lean is used to recieve plain plain js object instaed of mongoose document for perfomance 
        }
        else if (userOne && userTwo) {
            //fetching personal message between 2 users
            const room = [userOne, userTwo].sort(); //ensuring consistent query
            message = await Message.find({
                $or: [
                    { sender: userOne, recipient: userTwo },
                    { sender: userTwo, recipient: userOne }
                ]
            })
                .sort({ timestamp: -1 })
                .limit(50)
                .lean();

        }
    } catch (error) {

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
        res.status(500).send({ error: 'failed to save message', details: error.message })
    }

}

