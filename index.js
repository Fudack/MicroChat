const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./src/config');
const morgan = require('morgan');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const WebSocket = require('ws');

const app = express();
const PORT = config.PORT;
const wss = new WebSocket.Server({ port: 8080 });


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


mongoose.connect(config.mongoURI);
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    console.log('connected');

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});

wss.on('error', function error(err) {
    console.log('error', err);
});

wss.on('close', function close() {
    console.log('disconnected');
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/auth', (req, res) => {
    res.send('route auth');
});

app.get('/user', (req, res) => {
    res.send('route user');
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
