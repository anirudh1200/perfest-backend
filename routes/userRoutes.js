const express = require('express'),
	router = express.Router();

const userController = require('../app/controllers/userController');
const middleware = require('../app/middleware/middleware');

// @route		POST /user/logs
// @desc		will get the latest entries from ticket database
// @params	page(0,1,2,...)
// @return	array of objects {ename, vname, price, date}, totalCollected(money), totalSold(tickets)
// @permission	admin/volunteer
// TODO			think about making it realtime
// TODO			figure out user role(admin/volunteer) based on JWT or post param ??
router.post('/logs', middleware.authAdminVol, userController.getLogs);

// @route		POST /user/getExcelLogs
// @desc		admin will get all excel of all logs
// @params	token
router.post('/getExcelLogs', middleware.authAdmin, userController.getExcelLogs);

// @route		POST /user/list
// @desc		will get all users/volunteers
// @params	type(user/volunteer)
// @return	list(array of objects containing users/volunteers as requested) 
// @permission	admin
// TODO			check authorization status annd  permissions
router.post('/list', middleware.authAdmin, userController.getList);

// @route		POST /user/updateUser
// @desc		change user to volunteer
// @params		user_id of user to be upgraded
// @return		status wether upgraded or not
router.post('/updateUser', middleware.authAdmin, userController.updateUser);

// @route		POST /user/getAllTickets
// @desc		will get all the tickets of user
// @params		user token
// @return		array containing list of tickets
router.post('/getAllTickets', middleware.authUser, userController.getAllTickets);

// @route		POST /user/getTicket
// @desc		will get one particular ticket
// @params		ticketId
// @return		ticket(containing ticket info)
router.post('/getTicketById', middleware.authUser, userController.getTicketById);

// @route		POST /user/deleteUser
// @desc		will delete user whose _id is there in the token(can be done by volunteer)
// @params		userID
// @permission	volunteers
// @return 		update status either 200 or 422
router.post('/deleteUser', middleware.authVolunteer, userController.deleteUser);

//@route		POST /user/upgradeAnonymousToUser
//@desc			update users profile from anonyous to user
//@params		changes in this format
//				data={
//				 	name: ,
//				 	password: ,
//				 	contact: {
//				 		email: ,
//				 		phone: 
//				 	},
//				 	college: {
//				 		name: ,
//				 		department: ,
//				 		year: 
//				 	},
//				 	type: ,
//				 	csi_member: 
//				 }
// @return		token
router.post('/upgradeAnonymousToUser', userController.upgradeAnonymousToUser);

// @route		POST /user/updateUserProfile
// @desc		changes specified field in user profile
// @params		token, any filed present in user schema
// @params		success, error(if any)
router.post('/updateUserProfile', middleware.authAll, userController.updateUserProfile);

// @route		POST /user/getUserDetails
// @desc		get the userDetails
// @params		userId
/*
	Sample
{
	"_id" : ObjectId("5d7544e82e2c6b3c22c90bae"),
	"college" : {
		"name" : null,
		"department" : null,
		"year" : null
	},
	"name" : null,
	"password" : null,
	"type" : false,
	"csi_member" : false,
	"tickets" : [
		ObjectId("5d7544e82e2c6b3c22c90baf")
	],
	"contact" : {
		"email" : "abc@abc.com"
	}
}
*/
router.post('/getAnonymousUserDetails', userController.getAnonymousUserDetails);


// @route		POST /user/getCollege
// @desc		will get list of colleges present in databse
// @params		
// @return		array of college names,success status
// @permission	all
router.post('/getCollege', userController.getCollege);

// @route		POST /user/getUserDetails
// @desc		get user details 
// @params		token
// @return		array of college names,success status
// @permission	all
router.post('/getUserDetails', middleware.authAll , userController.getUserDetails);



module.exports = router;