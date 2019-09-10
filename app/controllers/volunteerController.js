const Events = require('../database/models/events');
const Volunteer = require('../database/models/volunteer');

exports.assignEvent = async (req, res) => {
	let eventId = req.body.eventId;
	let volunteerId = req.body.volunteerId;
	if (eventId && volunteerId) {
		await Events.findByIdAndUpdate(
			eventId,
			{ $push: { volunteers: volunteerId } }
		).then(async () => {
			await Volunteer.findByIdAndUpdate(
				volunteerId,
				{ $push: { events: eventId } }
			).then(async () => {
				res.json({ success: true });
			}, err => {
				console.log(err);
				res.json({ success: false, error: err });
			});
		}, err => {
			console.log(err);
			res.json({ success: false, error: err });
		});
	} else {
		console.log(err);
		res.json({ success: false, error: 'insufficient data' })
	}
}

exports.unassignEvent = async (req, res) => {
	let eventId = req.body.eventId;
	let volunteerId = req.body.volunteerId;
	if (eventId && volunteerId) {
		await Events.findByIdAndUpdate(
			eventId,
			{ $pull: { volunteers: volunteerId } }
		).then(async user => {
			console.log(user);
			await Volunteer.findByIdAndUpdate(
				volunteerId,
				{ $pull: { events: eventId } }
			).then(async volunteer => {
				console.log(volunteer);
				res.json({ success: true });
			}, err => {
				console.log(err);
				res.json({ success: false, error: err });
			});
		}, err => {
			console.log(err);
			res.json({ success: false, error: err });
		});
	} else {
		console.log(err);
		res.json({ success: false, error: 'insufficient data' })
	}
}

exports.deleteVolunteer = (req, res) => {
	let volunteerId = req.body.volunteerId;
	Volunteer.findOneAndDelete({ volunteerId })
		.then(console.log)
		.catch(console.log)
	return res.status(200);
}

exports.getDetails = async (req, res) => {
	let volunteerId = req.body.volunteerId;
	let volunteer = '';
	try {
		volunteer = await Volunteer.findById(volunteerId);
		res.json({ success: true, volunteer });
	} catch (err) {
		console.log(err);
		res.json({ success: false, volunteer, error: err });
	}
}