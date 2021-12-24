const { Router } = require('express');
const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

//set controller for router
const controller = require('../../controllers/customer/bookingController');
router.get('/',controller.list);

router.get('/makeBookingNote/:Phong', controller.book);
router.post('/addBookingNote', controller.savetoDB);

module.exports = router;