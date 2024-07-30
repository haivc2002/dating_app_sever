const express = require('express');
const router = express.Router();
const ListNominationController = require('../app/controllers/list_nomination_controller');

router.get('/listNomination', ListNominationController.listNomination);

module.exports = router;