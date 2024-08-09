const express = require('express');
const router = express.Router();
const MatchController = require('../app/controllers/match_controller');

router.post('/add', MatchController.add);
router.get('/listPairing', MatchController.listPairing);

module.exports = router;