const express = require('express'),
	router = express.Router();

const userController = require('../app/controllers/userController');

// @route   POST /user/logs
// @desc    will get the latest entries from ticket database
// @params	page(0,1,2,...)
// TODO			think about making it realtime
// TODO			figure out user role(admin/volunteer) based on JWT or post param ??
router.post('/logs', userController.getLogs);

module.exports = router;