const Events = require('../database/models/events');

exports.getAllEvents = async (req, res) => {
	let eventList;
	try {
		eventList = await Events.find();
	} catch (err) {
		res.json({ 'error': err, eventList });
		return;
	}
	res.json({eventList});
}

exports.getEvent = async (req, res) => {
	let eventId = req.params.id;
	let event = null;
	try{
		event = await Events.find({ _id: eventId });
	} catch(err){
		res.json({event, 'error': err});
	}
	res.json({event});
}