const express = require('express');
const router = express.Router();

//set controller for router
const controller = require('../controllers/mainPageController');
router.get('/Guest',controller.list);
router.get('/LeTan', controller.leTan);
router.get('/ThuNgan', controller.thuNgan);

module.exports = router;

