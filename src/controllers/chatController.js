const User = require('../models/user');

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { password: 0 }); // Excluir la contraseña
        res.json(user);
        console.log(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};