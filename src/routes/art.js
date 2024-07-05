const express = require('express');
const router = express.Router();
const artController = require('../app/controllers/admin/artController');
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

router.get('/viewart', artController.getForm);
router.get('/create', artController.formadd);
router.post('/add', artController.add);
router.post('/saveimage', upload.single('listimage'), artController.saveImage);
router.post('/deleteimage', artController.deleteImage);
router.get('/:id/formedit', artController.formedit);
router.put('/:id', artController.edit);
router.delete('/:id', artController.dele);


module.exports = router;


