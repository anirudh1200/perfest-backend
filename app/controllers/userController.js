const Ticket = require('../database/models/ticket');
const Volunteer = require('../database/models/volunteer');

exports.getLogs = async (req, res) => {
	let perPage = 25;
	// Make next line dynamic
	let role = 'volunteer';
	let page = req.body.page;
	let logList = [];
	if (role === 'admin') {
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
		res.json({ logList });
	} else if (role === 'volunteer') {
		// Make this dynamic after recognizing user
		let volunteer_id = '5d4dba0c49aa5904a1c349cd';
		let volunteer = await Volunteer.findById(volunteer_id).select('events');
		if (volunteer) {
			let events = volunteer.events;
			if (events.length > 0) {
				logList = await Ticket.find({ 'event': { $in: events } })
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
				res.json({ logList })
			} else {
				res.json({ logList });
				return;
			}
		} else {
			res.json({ error: 'invalid volunteer' });
			return;
		}
	} else {
		res.json({ error: 'invalid role' });
		return;
	}
	res.json({ success: true });
}

exports.updateUser = async (req, res) => {
	let role = "admin";// req.body.type/role;
	if (role == "admin"){
		
	}
}