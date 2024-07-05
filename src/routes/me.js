const express = require('express');
const router = express.Router();
const categoryController = require('../app/controllers/admin/categoryController');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));
router.get('/index', categoryController.getform);
router.post('/add', categoryController.add);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.dele);
router.get('/showdatajson', categoryController.showdatajson);

module.exports = router;


