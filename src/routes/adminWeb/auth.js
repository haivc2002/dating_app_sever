const express = require('express');
const router = express.Router();
const AuthController = require('../../app/controllers/admin/authController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploadtest');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.get('/register', AuthController.getRegister);
router.get('/add', upload.single('avatarR'), AuthController.postRegister);
router.post('/logout', AuthController.postLogout);

module.exports = router;