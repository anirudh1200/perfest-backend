const express = require('express'),
	router = express.Router(),
	volunteerController = require('../app/controllers/volunteerController'),
	middleware = require('../app/middleware/middleware');

// @route		POST /volunteer/assignEvent
// @desc		admin will be able to assign events to volunteers
// @params	eventId, volunteerId
// @return	success true/false
router.post('/assignEvent', middleware.authAdmin, volunteerController.assignEvent);

// @route		POST /volunteer/unassignEvent
// @desc		admin will be able to unassign events to volunteers
// @params	eventId, volunteerId
// @return	success true/false
router.post('/unassignEvent', middleware.authAdmin, volunteerController.unassignEvent);


// @route		POST /user/deleteVolunteer
// @desc		will delete Volunteer whose _id is there in the body(can be done by admins)
// @params		volunteerId
// @permission	admin
// @return 		update status either 200 or 422
router.post('/deleteVolunteer', middleware.authAdmin, volunteerController.deleteVolunteer);

// @route		POST /volunteer/getDetails
// @desc		admin/volunteer will be able to get his details
// @params	volunteerId
// @return	all fields in volunteer schema
router.post('/getDetails', middleware.authAdminVol, volunteerController.getDetails);

// @route		POST /volunteer/getLogs
// @desc		admin will get indivisual voulnteer logs
// @params	token, volunteerId
// @permission	admin
// @return	array of objects {ename, vname, price, date}, totalCollected(money), totalSold(tickets)
router.post('/getVolLogs', middleware.authAdmin, volunteerController.getVolLogs);

module.exports = router;