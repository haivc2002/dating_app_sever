const express = require('express');
const router = express.Router();
const PaymentController = require('../app/controllers/pay_ment_controller');

router.post('/create_payment_url', PaymentController.getUrl);
router.get('/vnpay_return', PaymentController.vnpReturn);
router.get('/checkPayment', PaymentController.checkPayment);

module.exports = router;