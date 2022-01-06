const { Router } = require('express');
const express = require('express');
const router = express.Router();

//set controller for router
const controller = require('../../controllers/customer/paymentController');
router.get('/',controller.list);
router.get('/makeBill/:Phong', controller.makeBill);
router.post('/addBill', controller.addBill);

module.exports = router;