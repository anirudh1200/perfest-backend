const Ticket = require('../database/models/ticket');
const Volunteer = require('../database/models/volunteer');
const User = require('../database/models/user');

exports.getLogs = async (req, res) => {
	let perPage = 25;
	let type = req.user.type;
	let page = req.body.page;
	let logList = [];
	if (type === 'admin') {
		logList = await Ticket.find({})
			.select('volunteer_id paid event')
			.limit(perPage)
			.skip(perPage * page)
			.sort({ 'date': -1 })
			.populate('volunteer_id')
			.populate('event')
			.exec()
		logList = logList.map(log => {
			return { vname: log['volunteer_id'].name, price: log.paid, ename: log.event.name }
		});
		let totalSold = await Ticket.countDocuments();
		let totalCollected = await Ticket.aggregate([
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
		res.json({ logList, totalSold, totalCollected });
		return;
	} else if (type === 'volunteer') {
		// Make this dynamic after recognizing user
		let volunteer_id = '5d4dc8baf7561527977b8f0c';
		let volunteer = await Volunteer.findById(volunteer_id).select('events');
		if (volunteer) {
			let events = volunteer.events;
			console.log(events.length)
			if (events.length > 0) {
				logList = await Ticket.find({ event: { $in: events } })
					.select('volunteer_id paid event')
					.limit(perPage)
					.skip(perPage * page)
					.sort({ 'date': -1 })
					.populate('volunteer_id')
					.populate('event')
					.exec()
				logList = logList.map(log => {
					return { vname: log['volunteer_id'].name, price: log.paid, ename: log.event.name }
				});
				let totalSold = await Ticket.countDocuments({ 'event': { $in: events } });
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
				res.json({ logList, totalSold, totalCollected });
				return;
			} else {
				res.json({ logList });
				return;
			}
		} else {
			res.json({ error: 'invalid volunteer' });
			return;
		}
	} else {
		res.status(401).json({ error: 'invalid role' });
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
				.select('name contact college')
		} catch (err) {
			res.json({ error: err })
		}
		res.json({ list });
		return;
	} else if (type === 'volunteer') {
		try {
			list = await Volunteer.find()
				// add/remove fileds from select as per necessity
				.select('name contact college')
		} catch (err) {
			res.json({ erroe: err });
		}
		res.json({ list });
		return;
	} else {
		res.status(401).json({ error: 'unatuhenticated' });
	}
}