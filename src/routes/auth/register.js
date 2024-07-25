const express = require('express');
const router = express.Router();
const RegisterController = require('../../app/controllers/auth/register_controller');

router.post('/register', RegisterController.registerApi);
router.post('/registerInfo', RegisterController.registerInfo);

module.exports = router;