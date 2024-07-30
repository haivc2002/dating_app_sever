const express = require('express');
const router = express.Router();
const RegisterController = require('../../app/controllers/register_controller');
const LoginController = require('../../app/controllers/login_controller');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/register', RegisterController.registerApi);
router.post('/registerInfo', RegisterController.registerInfo);
router.post('/addImage', upload.single('image'), RegisterController.addImage);
router.post('/registerInfoMore', RegisterController.registerInfoMore);

router.post('/login', LoginController.login);
router.get('/getInfo', LoginController.getInfo);

module.exports = router;