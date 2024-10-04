const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);


mongoose.connect(DB)
    .then(() => {
        console.log('Database connected Successfully');
    })
    .catch((error) => {
        console.log('Failed to connect the Dataabase', error.message)
    })



const app = require('./app');

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Server is listening to port:', port)
})