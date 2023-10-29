const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/admin/authController');

router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.post('/logout', AuthController.postLogout);

module.exports = router;