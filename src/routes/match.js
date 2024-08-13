const express = require('express');
const router = express.Router();
const MatchController = require('../app/controllers/match_controller');

router.post('/add', MatchController.add);
router.get('/listPairing', MatchController.listPairing);
router.get('/listUnmatchedUsers', MatchController.listUnmatchedUsers);
router.put('/checkNewState', MatchController.checkNewState);

module.exports = router;