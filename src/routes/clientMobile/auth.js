const express = require('express');
const router = express.Router();
const authController = require('../../app/controllers/client/authController');
const methodOverride = require('method-override');

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

router.post('/registerAPI', upload.single('avatar'), authController.registerAPI);
router.get('/datauserjsonAPI', authController.datauserjsonAPI);
router.post('/loginAPI', authController.loginAPI);
router.get('/showjsontest', authController.showjsontest);

module.exports = router;