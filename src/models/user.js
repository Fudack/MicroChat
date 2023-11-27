const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, lowercase: true },
    email: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
