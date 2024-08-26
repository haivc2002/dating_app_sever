
const express = require('express');
const router = express.Router();
const Update = require('../app/controllers/update_controller');

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

router.put('/updateUser', Update.updateUser);
router.put('/updateLocation', Update.updateLocation);
router.put('/updateImage', upload.single('image'), Update.updateImage);
router.delete('/deleteImage/:id', Update.deleteImage);

module.exports = router;