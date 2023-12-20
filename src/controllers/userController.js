const User = require('../models/user');

exports.getAllUsers = async (req, res) => {

    try {
        const users = await User.find({}, { password: 0 }); // Excluir la contraseña
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { password: 0 }); // Excluir la contraseña
        res.json({user: { id: user._id, name: user.name, email: user.email }});
        console.log(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
