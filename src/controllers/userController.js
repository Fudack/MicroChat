const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Excluir la contraseña
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
