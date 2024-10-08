const bcrypt = require('bcrypt');
const User = require('../models/user');
const config = require('../config');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
try {
    const {  email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '1h' });
        res.status(200).json({ message: 'User logged', token, user: { id: user._id, name: user.name, email: user.email } });
    } else {
        console.log('Error en el login');
        res.status(401).json({ message: 'Invalid credentials' });
    }
} catch (error) {
    console.log('Error en el login', error);
    res.status(500).json({ error: error.message });
}}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }else{
            const user = await User.create({ name, email, password });
            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '1h' });
            res.status(201).json({ message: 'User created', token });
        }
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
}