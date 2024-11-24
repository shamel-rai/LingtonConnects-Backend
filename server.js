const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { initializesocket } = require('./services/socketService');

dotenv.config({ path: '. /config.env' });

const db = process.env.DATABASE.replace('PASSWORD', process.env.PASSWORD);

mongoose.connect(DB)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log(`Failed to connect database: ${error.message}`);
    });


const app = require('./app');
const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
    console.log(`Server is listening to port: ${port}`)
})

initializesocket(server); 