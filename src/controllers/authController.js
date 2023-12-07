const bcrypt = require('bcrypt');
const User = require('../models/user');
const config = require('../config');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
try {
    const {  email, password } = req.body;
    const user = await User.findOne({ email });
    console.log('user', user);

    if (user && (await bcrypt.compare(password, user.password))) {
        token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
        console.log('token', token);
        res.status(200).json({ message: 'User logged', token });
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
        const user = await User.create({ name, email, password });
        console.log('user', user);
        if (await User.findOne({ email })) {
            console.log('Error en el registro');
            return res.status(400).json({ message: 'User already exists' });
        }

        res.status(201).json({ message: 'User created' });

    } catch (error) {

    
        res.status(500).json({ error: error.message });
    }
}
