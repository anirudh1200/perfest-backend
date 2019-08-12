const Ticket = require('../database/models/ticket');
const Volunteer = require('../database/models/volunteer');
const User = require('../database/models/user');

exports.getLogs = async (req, res) => {
	let perPage = 25;
	let userType = req.user.userType;
	let page = req.body.page;
	let logList = [];
	if (userType === 'admin') {
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
	} else if (userType === 'volunteer') {
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
	let userType = req.body.userType;
	if (userType === 'user') {
		try {
			let list = await User.find()
				// add/remove fileds from select as per necessity
				.select('name contact college')
		} catch (err) {

		}
		res.json({ list });
		return;
	} else if (userType === 'volunteer') {
		let list = await Volunteer.find()
			// add/remove fileds from select as per necessity
			.select('name contact college')
		res.json({ list });
		return;
	} else {
		res.status(401).json({ error: 'unatuhenticated' });
	}
}

exports.updateUser = async (req, res) => {
	let role = "admin";// req.body.type/role;
	let user = new User();
	User.findOne({ _id: /*req.user._id*/ "5d4ee972a6a28971e4ba87a1" })
		.then((user) => {
			let data = user.toJSON()
			// console.log("asdasdasd", user);
			delete data._id
			delete data.type
			delete data.csi_member
			delete data.tickets
			delete data._v
			data.contact.phone = "98948298495"
			data.contact.email = "kolisomesh@gmail.com"
			console.log(data);
			let newVolunteer = new Volunteer(data);

			newVolunteer.save()
				.then(console.log)
				.catch(console.log);
		})
		.catch((err) => {
			console.log(err);
			res.status(500);
		})
	// User.findOneAndDelete({ _id: "5d4ee972a6a28971e4ba87a1" })
	// 	.then(console.log)
	// 	.catch(console.log);
}