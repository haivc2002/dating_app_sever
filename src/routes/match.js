const express = require('express');
const router = express.Router();
const MatchController = require('../app/controllers/match_controller');

router.post('/add', MatchController.add);

module.exports = router;