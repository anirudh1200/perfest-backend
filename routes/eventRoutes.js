const express = require('express'),
	router = express.Router();

const eventController = require('../app/controllers/eventController');
const middleware = require('../app/middleware/middleware');

// @route		GET /event/list
// @desc		will get all events
// @return	eventList(array of all events)
router.get('/list', eventController.getAllEvents);

//@route		GET /event/dropdownList
// @desc		will get all events(minified for dropdown)
// @return	eventList(_is, name, cost)
router.get('/dropdownList', eventController.getAllEventsForDropdown);

// @route		GET /event/:id
// @desc		will get a particular event
// @return	event(the event info)
router.get('/:id', eventController.getEvent);

// @route		POST /event/post
// desc			add an event
// @return	object(success: true/false)
// @params	object event(name, description, date, cost, image, venue, cost)
router.post('/add', middleware.authAdmin, eventController.addEvent);

// @route		POST /event/delete
// @desc		delete an event
// @return	object(success: true/false)
// @params	eventId
router.post('/delete', middleware.authAdmin, eventController.deleteEvent);

// @route		POST /event/update
// @desc		edit an event
// @return	object(success: true/false)
// @params	object event
router.post('/update', eventController.deleteEvent);

module.exports = router;