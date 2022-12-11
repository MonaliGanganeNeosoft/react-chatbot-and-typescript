const express = require('express');
const { CONFIRM_ORDER, ORDER_DETAILS } = require('../Controller/OrderController');
const router = express.Router();

router.post('/confirmorder',CONFIRM_ORDER)
router.post('/orderdetails', ORDER_DETAILS)
module.exports = router