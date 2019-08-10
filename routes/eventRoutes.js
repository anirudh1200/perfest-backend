const express = require('express'),
	router = express.Router();

const eventController = require('../app/controllers/eventController');

// @route		GET /event/list
// @desc		will get all events
// @return	eventList(array of all events)
router.get('/list', eventController.getAllEvents);

// @route		GET /event/:id
// @desc		will get a particular event
// @return	event(the event info)
router.get('/:id', eventController.getEvent);

module.exports = router;