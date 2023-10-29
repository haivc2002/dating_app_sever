const express = require('express');
const router = express.Router();
const homeController = require('../app/controllers/visitor/homeController');
const methodOverride = require('method-override');

router.get('/', homeController.start);

module.exports = router;