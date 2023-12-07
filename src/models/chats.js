const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    // Define los campos del modelo aquí
    // Por ejemplo, puedes tener un campo para el nombre del chat y otro para los mensajes
    name: {
        type: String,
        required: true
    },
    messages: [{
        sender: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
