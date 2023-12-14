const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
