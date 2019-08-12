const express = require('express'),
	router = express.Router();

const userController = require('../app/controllers/userController');
const middleware = require('../app/middleware/middleware');

// @route		POST /user/logs
// @desc		will get the latest entries from ticket database
// @params	page(0,1,2,...)
// @return	array of objects {ename, vname, price}, totalCollected(money), totalSold(tickets)
// @permission	admin/volunteer
// TODO			think about making it realtime
// TODO			figure out user role(admin/volunteer) based on JWT or post param ??
router.post('/logs', middleware.authAdminVol, userController.getLogs);

// @route		POST /user/list
// @desc		will get all users/volunteers
// @params	type(user/volunteer)
// @return	list(array of objects containing users/volunteers as requested) 
// @permission	admin
// TODO			check authorization status annd  permissions
router.post('/list', middleware.authAdmin, userController.getList);

// @route		POST /user/getAllTickets
// @desc		will get all the tickets of user
// @params	none
// @return	array containing list of tickets
router.post('/getAllTickets', middleware.authUser, userController.getAllTickets);

// @route		POST /user/getTicket
// @desc		will get one particular ticket
// @params	ticketId
// @return	ticket(containing ticket info)
router.post('/getTicketById', middleware.authUser, userController.getTicketById);
>>>>>>> 779f2a12d55d2dbc7c4323e7f5bcc904cae2ba1a

module.exports = router;