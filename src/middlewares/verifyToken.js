const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports  = (req, res, next) => {
    const token = req.headers.authorization;
    console.log('token', token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
            }
            req.userId = decoded.userId;
            next();
        });
};
