const Events = require('../database/models/events');

exports.getAllEvents = async (req, res) => {
	let eventList = [];
	try {
		eventList = await Events.find();
	} catch (err) {
		res.json({ success: false, eventList, error: toString(err) });
		return;
	}
	res.json({ success: true, eventList });
}

exports.getEvent = async (req, res) => {
	let eventId = req.params.id;
	let event = null;
	try {
		event = await Events.find({ _id: eventId });
	} catch (err) {
		res.json({ success: false, event, error: toString(err) });
	}
	res.json({ success: true, event });
}

exports.addEvent = async (req, res) => {
	let event = req.body.event;
	let newEvent = new Events(event);
	try {
		await newEvent.save();
	} catch (err) {
		res.json({ success: false, error: toString(err) });
		return;
	}
	res.json({ success: true });
}

exports.deleteEvent = async (req, res) => {
	let eventId = req.body.eventId;
	if (eventId) {
		try {
			await Events.findByIdAndDelete({ _id: eventId });
		} catch (err) {
			res.json({ success: false, error: toString(err) });
			return;
		}
		res.json({ success: true });
	} else {
		res.json({ success: false, error: 'no such event' });
	}
}

exports.editEvent = async (req, res) => {
	let event = req.body.event;
	if (event) {
		try {
			await Events.findByIdAndUpdate({ _id: event._id }, event);
		} catch (err) {
			res.json({ success: false, error: toString(err) });
		}
		res.json({ success: true });
	} else {
		res.json({ success: false, error: 'no data passed' })
		return;
	}
}