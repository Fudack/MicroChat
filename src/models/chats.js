const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
    participants: [{ type: String, ref: 'users' }],
    messages: [{text: String, _id: false, sender: String}]
});

const Chat = model('chat', chatSchema);

module.exports = Chat;