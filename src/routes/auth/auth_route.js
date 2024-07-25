const express = require('express');
const router = express.Router();
const RegisterController = require('../../app/controllers/register_controller');
const LoginController = require('../../app/controllers/login_controller');

router.post('/register', RegisterController.registerApi);
router.post('/registerInfo', RegisterController.registerInfo);
router.post('/addImage', RegisterController.addImage);
router.post('/registerInfoMore', RegisterController.registerInfoMore);

router.post('/login', LoginController.login);

module.exports = router;