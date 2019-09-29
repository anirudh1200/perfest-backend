const Events = require('../database/models/events');
const Volunteer = require('../database/models/volunteer');
const Ticket = require('../database/models/ticket');

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

exports.getVolLogs = async (req, res) => {
	let logList = [];
	let totalSold = 0;
	let totalCollected = 0;
	let totalBalance = 0;
	let volunteer_id = req.body.volunteerId;
	try {
		logList = await Ticket.find({ 'volunteer_id.value': volunteer_id })
			// .skip(perPage * page)
			// .limit(perPage)
			.sort({ 'date': -1 })
			.select('date event price paid balance user_id')
			.populate('event')
			.populate('user_id')
	} catch (err) {
		return res.json({ success: true, logList, totalSold, totalCollected, totalBalance });
	}
	logList = logList.map(log => {
		totalBalance = totalBalance + log.balance;
		totalCollected = totalCollected + log.paid;
		try {
			return { _id: log._id, vname: 'Vol', ename: log.event.name, date: log.date, price: log.price, paid: log.paid, uemail: log['user_id'].contact.email };
		} catch (err) {
			console.log(log);
		}
	});
	totalSold = logList.length;
	res.json({ success: true, logList, totalSold, totalCollected, totalBalance });
	return;
}

exports.updateAdminBalance = async (req, res) => {
	let newBalance = req.body.newBalance;
	let volunteerId = req.body.volunteerId;
	try {
		await Volunteer.findByIdAndUpdate(volunteerId, { $set: { adminBalance: newBalance } });
		return res.json({ success: true });
	} catch (err) {
		console.log(err);
		return res.json({ success: false, error: err });
	}
}