const express = require('express');
const router = express.Router();
const testlController = require('../app/controllers/testController');
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
router.get('/viewtest', testlController.viewtest);
router.post('/add', upload.single('image'), testlController.add);
router.get('/showdatajson', testlController.showdatajson);

module.exports = router;