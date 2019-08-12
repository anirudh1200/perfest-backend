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
// @desc		will delete Volunteer whose _id is there in the token(can be done by admins)
// @params		volunteerId
// @permission	admin
// @return 		update status either 200 or 422
router.post('/deleteVolunteer', middleware.authAdmin, volunteerController.deleteVolunteer);


module.exports = router;