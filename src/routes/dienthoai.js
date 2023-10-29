const express = require('express');
const router = express.Router();
const dienthoaiController = require('../app/controllers/DienthoaiController');
// const authMiddleware = require('../app/middlewares/authMiddleware');
// const checkAdminRole = require('../app/middlewares/checkAdminRole');
router.get('/:slug', dienthoaiController.show);


//router.use(checkAdminRole.requireAuth);     // nhảy ra login 

//   router.use(authMiddleware.requireAuth);                    // nhảy ra login 
router.get('/admin/create', dienthoaiController.create);
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
router.post('/store', upload.single('image'), dienthoaiController.store);
router.get('/:id/edit', dienthoaiController.edit);
router.put('/:id', dienthoaiController.update);
router.delete('/:id', dienthoaiController.destroy);








module.exports = router


