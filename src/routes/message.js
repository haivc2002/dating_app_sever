const express = require('express');
const router = express.Router();
const MessageController = require('../app/controllers/message_controller');

router.post('/send', MessageController.sendMessage);
router.get('/outsideViewMessage', MessageController.outsideViewMessage);
router.put('/isCheckNewMessage', MessageController.isCheckNewMessage);

module.exports = router;