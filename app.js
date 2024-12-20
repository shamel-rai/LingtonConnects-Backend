const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');


const authRoutes = require('./routes/Authroute');
const statusRoutes = require('./routes/ServerstatusRoute');
const postRoutes = require('./routes/PostRoutes');
const messageRoutes = require('./routes/MessageRoutes');


const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,POST,PUT,DELETE'
}))

app.use('/api/v1', authRoutes);
app.use('/api/v1', statusRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1/', messageRoutes)


module.exports = app