const express = require('express');
const router = express.Router();
const chatContoller = require('../controllers/chatController');

router.get('/:id', chatContoller.getChatById);

module.exports = router;
