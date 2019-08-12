const express = require('express'),
	router = express.Router();

const volunteerController = require('../app/controllers/volunteerController');
const middleware = require('../app/middleware/middleware');

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

module.exports = router;