const Events = require('../database/models/events');
const Volunteer = require('../database/models/volunteer');
const mongoose = require('mongoose');

exports.assignEvent = async (req, res) => {
	let eventId = req.body.eventId;
	let volunteerId = req.body.volunteerId;
	if (eventId && volunteerId) {
		await Events.findByIdAndUpdate(
			eventId,
			{ $push: { volunteers: volunteerId } }
		).then(async user => {
			await Volunteer.findByIdAndUpdate(
				volunteerId,
				{ $push: { events: eventId } }
			).then(async volunteer => {
				res.json({ success: true });
			}, err => {
				res.json({ success: false, error: err });
			});
		}, err => {
			res.json({ success: false, error: err });
		});
	} else {
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
				res.json({ success: false, error: err });
			});
		}, err => {
			res.json({ success: false, error: err });
		});
	} else {
		res.json({ success: false, error: 'insufficient data' })
	}
}

exports.deleteVolunteer = (req, res) => {
	let volunteerId=req.user._id;
	Volunteer.findOneAndDelete({ _id: volunteerId })
		.then(console.log())
		.catch(console.log())
	return res.status(200);
}
