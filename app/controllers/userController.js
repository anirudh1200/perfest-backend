const Ticket = require('../database/models/ticket');
const Volunteer = require('../database/models/volunteer');
const User = require('../database/models/user');

exports.getLogs = async (req, res) => {
	let perPage = 25;
	let type = req.user.type;
	let page = req.body.page;
	let logList = [];
	let totalSold = 0;
	let totalCollected = 0;
	if (type === 'admin') {
		logList = await Ticket.find({})
			.select('volunteer_id paid event date')
			.limit(perPage)
			.skip(perPage * page)
			.sort({ 'date': -1 })
			.populate('volunteer_id')
			.populate('event')
			.exec()
		logList = logList.map(log => {
			return { vname: log['volunteer_id'].name, price: log.paid, ename: log.event.name, date: log.date }
		});
		totalSold = await Ticket.countDocuments();
		totalCollected = await Ticket.aggregate([
			{
				$group: {
					_id: '',
					paid: { $sum: '$paid' }
				}
			}, {
				$project: {
					_id: 0,
					paid: '$paid'
				}
			}
		]);
		totalCollected = totalCollected[0].paid;
		res.json({ success: true, logList, totalSold, totalCollected });
		return;
	} else if (type === 'volunteer') {
		let volunteer_id = req.user.userId;
		let volunteer = await Volunteer.findById(volunteer_id).select('events');
		if (volunteer) {
			let events = volunteer.events;
			if (events.length > 0) {
				logList = await Ticket.find({ 'event': { $in: events } })
					.select('volunteer_id paid event date')
					.limit(perPage)
					.skip(perPage * (page - 1))
					.sort({ 'date': -1 })
					.populate('volunteer_id')
					.populate('event')
				console.log(logList);
				logList = logList.map(log => {
					return { vname: log['volunteer_id'].name, price: log.paid, ename: log.event.name, date: log.date }
				});
				totalSold = await Ticket.countDocuments({ 'event': { $in: events } });
				totalCollected = await Ticket.aggregate([
					{
						$match: {
							'event': { $in: events }
						}
					},
					{
						$group: {
							_id: '',
							paid: { $sum: '$paid' }
						}
					}, {
						$project: {
							_id: 0,
							paid: '$paid'
						}
					}
				]);
				totalCollected = totalCollected[0].paid;
				res.json({ success: true, logList, totalSold, totalCollected });
				return;
			} else {
				res.json({ success: true, logList, totalSold, totalCollected });
				return;
			}
		} else {
			res.json({ success: false, error: 'invalid volunteer' });
			return;
		}
	} else {
		res.status(401).json({ success: false, error: 'invalid role' });
		return;
	}
}

exports.getList = async (req, res) => {
	let type = req.body.type;
	let list = [];
	if (type === 'user') {
		try {
			list = await User.find()
				// add/remove fileds from select as per necessity
				.select('name contact')
		} catch (err) {
			res.json({ success: false, list, error: err })
		}
		list = list.map(user => {
			return { _id: user._id, name: user.name, email: contact.email }
		});
		res.json({ success: true, list });
		return;
	} else if (type === 'volunteer') {
		try {
			list = await Volunteer.find()
				// add/remove fileds from select as per necessity
				.select('name contact')
		} catch (err) {
			res.json({ success: false, list, error: err });
		}
		list = list.map(vol => {
			return { _id: vol._id, name: vol.name, email: vol.email }
		});
		res.json({ success: true, list });
		return;
	} else {
		res.status(401).json({ success: false, list, error: 'unatuhenticated' });
	}
}

exports.updateUser = async (req, res) => {
	User.findOne({ 'contact.email': req.body.email })
		.then((user) => {
			let data = user.toJSON()
			delete data._id
			delete data.type
			delete data.csi_member
			delete data.tickets
			delete data._v
			let newVolunteer = new Volunteer(data);
			newVolunteer.save()
				.then(() => {
					User.findOneAndDelete({ 'contact.email': req.body.email })
						.then(() => {
							res.json({ success: true });
							return;
						})
						.catch(err => {
							res.json({ success: false, error: toString(err) });
							return;
						});
				})
				.catch(err => {
					res.json({ success: false, error: toString(err) });
					return;
				});
		})
		.catch(err => {
			res.json({ success: false, error: toString(err) });
			return;
		});
}

exports.getAllTickets = async (req, res) => {
	let userId = req.user._id;
	let ticketList = [];
	try {
		ticketList = await Ticket.find({ user_id: userId })
			.select('valid event')
			.populate('event')
	} catch (err) {
		res.json({ success: false, ticketList, error: toString(err) });
		return;
	}
	console.log(ticketList);
	res.json({ success: true, ticketList });
}

exports.getTicketById = async (req, res) => {
	let ticketId = req.user.ticketId;
	let ticket = '';
	try {
		ticket = await Ticket.findOne({ _id: ticketId })
			.select('valid event price paid balance participantNo date')
			.populate('event')
	} catch (err) {
		console.log(err);
		res.json({ success: false, ticket, error: toString(err) });
		return;
	}
	res.json({ success: true, ticket });
}

exports.deleteUser = (req, res) => {
	User.findOneAndDelete({ _id: req.user._id })
		.then(console.log())
		.catch(console.log())
	return res.status(200);
}

exports.updateProfile = async (req, res) => {
	let userId = req.body.userId;
	let UpdatedData = req.body.data;
	try {
		await User.findByIdAndUpdate({ _id: userId }, UpdatedData);
	}
	catch (err) {
		console.log(err);
		res.json({ success: false, error: err });
		return;
	}
	res.json({ success: true });
}

exports.getAnonymousUserDetails = async (req, res) => {
	let userId = req.body.userId;
	let user;
	try {
		user = await User.findById(userId);
	}
	catch (err) {
		console.log(err);
		res.json({ success: false, error: err });
		return;
	}
	console.log(user);
	res.json({ success: true, user });
}