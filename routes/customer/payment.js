const express = require('express');
const router = express.Router();

//set controller for router
const controller = require('../../controllers/customer/paymentController');
router.get('/',controller.list);

module.exports = router;