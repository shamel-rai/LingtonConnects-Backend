const socketIo = require('socket.io');


let io;


const initializedSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
            Credential: true,
        }
    });

    io.on('Connection', (socket) => {
        console.log("A user connected", socket.id);

        socket.on('register', (userId) => {
            socket.join(userId.toString());
            console.log(`User ${userId} joined the room ${userId}`)
        });

        socket.on('disconnect', () => {
            console.log('User disconnected ', socket.id);
        })
    })

    return io;
}

const getSocketInstance = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!!!!");
    }
    return io;
}


module.exports ={
    initializedSocket,
    getSocketInstance
}