const express = require('express'),
	router = express.Router();

const eventController = require('../app/controllers/eventController');

// @route		GET /event/list
// @desc		will get tall events
// @return	eventList(array of all events)
router.get('/list', eventController.getAllEvents);

module.exports = router;