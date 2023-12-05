const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log('No user found with this email');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const result = await bcrypt.compare(password, user.password);
        console.log('user', user);
        console.log('result', result);

        if (result) {
            res.status(201).json({ message: 'User logged' });
        } else {
            console.log('Invalid password');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log('Error en el login', error.message);
        res.status(500).json({ error: error.message });
    }
}

exports.register = async (req, res) => {
    console.log('register', req.body);
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });

        // Espera a que se complete la operación de guardar
        await user.save();

        // Ahora puedes iniciar sesión
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.log('Error en el registro', error.message);
        res.status(500).json({ error: error.message });
    }
}