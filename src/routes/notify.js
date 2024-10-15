const express = require('express');
const router = express.Router();
const NotifyController = require('../app/controllers/notify_controller');

router.post('/push', NotifyController.push);

module.exports = router;