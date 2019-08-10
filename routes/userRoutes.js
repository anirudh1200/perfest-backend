const express = require('express'),
	router = express.Router();

const userController = require('../app/controllers/userController');

// @route		POST /user/logs
// @desc		will get the latest entries from ticket database
// @params	page(0,1,2,...)
// @return	array of objects {ename, vname, price}, totalCollected(money), totalSold(tickets)
// @permission	admin/volunteer
// TODO			think about making it realtime
// TODO			figure out user role(admin/volunteer) based on JWT or post param ??
router.post('/logs', userController.getLogs);

// @route		POST /user/list
// @desc		will get all users/volunteers
// @params	type(user/volunteer)
// @return	list(array of objects containing users/volunteers as requested) 
// @permission	admin
// TODO			check authorization status annd  permissions
router.post('/list', authAdmin, userController.getList);

module.exports = router;