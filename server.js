// server.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose.connect(DB)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.log('Failed to connect to the Database', error.message);
    });

const app = require('./app'); // Ensure this is your Express app
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});

// Set up Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (userId) => {
        socket.join(userId.toString());
        console.log(`User ${userId} joined room ${userId}`);
    });

    // socket.on('send_message', (messageData) => {
    //     console.log('Message received:', messageData);
    //     messageData.sender = messageData.sender || 'Anonymous'; // Set a default sender
    //     exports.sendMessage(messageData, io);
    // });

      chatController(socket, io);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Import routes and pass the Socket.io instance
const notificationRoute = require('./routes/NotificationRoutes')(io);
app.use('/api/v1', notificationRoute); // Mount the notification routes

const messageRoute = require('./routes/MessageRoutes');
const chatRoute = require('./routes/MessageRoutes'); 
const { chatController } = require('./controller/MessageController');
app.use('/api/v1', messageRoute);
app.use('/api/v1', chatRoute)

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
