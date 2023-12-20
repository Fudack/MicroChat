const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Import jwt
const config = require('./src/config');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const Chat = require('./src/models/chats');
const e = require('express');
// Create a new Express application
const app = express();

// Create an HTTP server from the Express application
const server = http.createServer(app);

// Create a new instance of Socket.IO from the HTTP server
const io = socketIo(server);

//configuracion de middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


//configuracion de base de datos
mongoose.connect(config.mongoURI);
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});




//configuracion de rutas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/',(req, res) => {
    res.sendFile(process.cwd() + '/client/home.html');
});


//configuracion de autenticacion y adminbistracion de usuarios 
app.get('/login', (req, res) => {
    res.sendFile(process.cwd() + '/client/login.html');
});

app.get('/auth', (req, res) => {
    res.send('route auth');
});

app.get('/register', (req, res) => {
    res.sendFile(process.cwd() + '/client/register.html');
});




// configuraciuon de chats
app.get('/chat/:id', (req, res) => {
    res.sendFile(process.cwd() + '/client/chats.html');
    });

io.on('connection', async (socket) => {
    // Obtener el nombre de la sala
    const sender = socket.handshake.auth.sender.email;
    const receiver = socket.handshake.auth.receiver.email;
    const room = sender + receiver;

    // Crear la sala si no existe
    const roomExists = await Chat.findOne({ participants: { $all: [sender, receiver] } });
    if (!roomExists) {
        await Chat.create({ participants: [sender, receiver], messages: [] });
    }else{
        console.log('room exists');
    }

    // Unir el socket a la sala
    socket.join(room);
    console.log('user connected');

    // Enviar mensaje
    socket.on('send message', async (msg) => {
        try {
            const chat = await Chat.findOne({ participants: { $all: [sender, receiver] } });
            chat.messages.push({text: msg, sender: sender});
            await chat.save();
            io.to(room).emit('chat messages', chat.messages);
        } catch (err) {
            console.log(err);
        }
    });

    // Desconectar el socket de la sala
    socket.on('disconnect', async () => {
        // Recuperar mensajes
        try {
            const chat = await Chat.findOne({ participants: { $all: [sender, receiver] } });
            io.to(room).emit('chat messages', chat.messages);
        } catch (err) {
            console.log(err);
        }
        socket.leave(room);
    });
});



//configuracion de puerto para el server
server.listen(config.PORT, () => console.log('Listening on port ' + config.PORT));
