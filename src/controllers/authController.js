const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const config = require('../config');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log('No user found with this email');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const result = await bcrypt.compare(password, user.password);


        if (result) {
            const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
            res.status(201).json({ message: 'User logged', token , success: true});
        } else {
            console.log('Invalid password');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log('Error en el login', error.message);
        res.status(500).json({ error: error.message });
    }
}
exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.token;
    console.log(bearerHeader);
    
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, config.jwtSecret, (err, authData) => {
            if (err) {
                res.sendStatus(401); // Cambiado de 403 a 401
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(401); // Cambiado de 403 a 401
    }
}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });

        // Espera a que se complete la operación de guardar
        await user.save();

        // Ahora puedes iniciar sesión
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered', token });
    } catch (error) {
        console.log('Error en el registro', error.message);
        res.status(500).json({ error: error.message });
    }
}
