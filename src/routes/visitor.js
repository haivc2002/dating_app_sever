const express = require('express');
const router = express.Router();
const categoryController = require('../app/controllers/admin/visitorController');
const methodOverride = require('method-override');

router.get('/getform', categoryController.getForm);

module.exports = router;