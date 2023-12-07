const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./src/config');
const morgan = require('morgan');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const socket = require('socket.io');

const app = express();
const PORT = config.PORT;




app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


mongoose.connect(config.mongoURI);
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
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
