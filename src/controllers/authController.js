const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const config = require('../config');

exports.login = async (req, res) => {
try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: 'User logged', token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
} catch (error) {
    console.log('Error en el login', error);
    res.status(500).json({ error: error.message });
}}

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        res.json({ token });
        res.status(201).json({ message: 'User created' });
        res.redirect('/auth/login');
    } catch (error) {
        console.log('Error en el registro', error);
        res.status(500).json({ error: error.message });
    }
}
