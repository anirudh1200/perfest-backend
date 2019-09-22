const Ticket = require('../database/models/ticket');
const Volunteer = require('../database/models/volunteer');
const User = require('../database/models/user');
const jwt = require('jsonwebtoken');
const excel = require('excel4node');
const fs = require('fs');

exports.getLogs = async (req, res) => {
	let perPage = 25;
	let type = req.user.type;
	let page = req.body.page - 1;
	let logList = [];
	let totalSold = 0;
	let totalCollected = 0;
	if (type === 'admin') {
		logList = await Ticket.find({})
			// .skip(perPage * page)
			// .limit(perPage)
			.sort({ 'date': -1 })
			.select('volunteer_id paid event date user_id')
			.populate('volunteer_id.value')
			.populate('event')
			.populate('user_id')
		try {
			logList = logList.map(log => {
				try {
					return { vname: log['volunteer_id'].value.name, price: log.paid, ename: log.event.name, date: log.date, uemail: log['user_id'].contact.email }
				} catch (err) {
					console.log(err);
				}
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
		} catch (err) {
			res.json({ success: true, logList, totalSold, totalCollected });
		}
	} else if (type === 'volunteer') {
		let volunteer_id = req.user.userId;
		let volunteer = await Volunteer.findById(volunteer_id).select('sold');
		if (volunteer) {
			let ticketsSold = volunteer.sold.ticket;
			if (ticketsSold.length > 0) {
				logList = await Ticket.find({ '_id': { $in: ticketsSold } })
					// .skip(perPage * page)
					// .limit(perPage)
					.sort({ 'date': -1 })
					.select('date event price')
					.populate('event')
				logList = logList.map(log => {
					return { vname: 'You', ename: log.event.name, date: log.date, price: log.price, uemail: log['user_id'].contact.email }
				});
				totalSold = ticketsSold.length;
				totalCollected = volunteer.sold.amountCollected;
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
			console.log(err);
			res.json({ success: false, list, error: err });
			return;
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
			console.log(err);
			res.json({ success: false, list, error: err });
			return;
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
							console.log(err);
							res.json({ success: false, error: toString(err) });
							return;
						});
				})
				.catch(err => {
					console.log(err);
					res.json({ success: false, error: toString(err) });
					return;
				});
		})
		.catch(err => {
			console.log(err);
			res.json({ success: false, error: toString(err) });
			return;
		});
}

exports.getAllTickets = async (req, res) => {
	let userId = req.user.userId;
	let ticketList = [];
	let userUrl = "";
	try {
		ticketList = await Ticket.find({ user_id: userId })
			.select('valid event url')
			.populate('event')
		// userUrl = await User.findOne({ _id: userId })
		// 	.select('url')
	} catch (err) {
		console.log(err);
		res.json({ success: false, ticketList, error: toString(err) });
		return;
	}
	// console.log(ticketList);
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
		.then(console.log)
		.catch(console.log)
	return res.status(200);
}

exports.upgradeAnonymousToUser = async (req, res) => {
	let userId = req.body.userId;
	let UpdatedData = req.body.data;
	let token;
	try {
		await User.findByIdAndUpdate({ _id: userId }, UpdatedData);
	}
	catch (err) {
		console.log(err);
		res.json({ success: false, token, error: err });
		return;
	}
	token = jwt.sign({
		type: 'user',
		userId: userId,
	}, "secret", {
		expiresIn: "1d",
	});
	res.json({ success: true, token });
}

exports.updateUserProfile = async (req, res) => {
	let userId = req.user._id;
	let error = '';
	try {
		if (req.body.name) {
			await User.findByIdAndUpdate({ _id: userId }, { $set: { name: req.body.name } });
		} else if (req.body.password) {
			await User.findByIdAndUpdate({ _id: userId }, { $set: { password: req.body.password } });
		} else if (req.body.contact.email) {
			await User.findByIdAndUpdate({ _id: userId }, { $set: { 'contact.email': req.body.contact.email } });
		} else if (req.body.contact.phone) {
			await User.findByIdAndUpdate({ _id: userId }, { $set: { 'contact.phone': req.body.contact.phone } });
		} else if (req.body.college.name) {
			await User.findByIdAndUpdate({ _id: userId }, { $set: { 'college.name': req.body.college.name } });
		} else if (req.body.college.department) {
			await User.findByIdAndUpdate({ _id: userId }, { $set: { 'college.department': req.body.college.department } });
		} else if (req.body.college.year) {
			await User.findByIdAndUpdate({ _id: userId }, { $set: { name: req.body.name } });
		} else {
			error = 'no field specified';
		}
	} catch (err) {
		console.log(err);
		res.json({ success: false, error: err });
		return;
	}
	if (error) {
		console.log(err);
		res.json({ success: false, error });
		return;
	} else {
		res.json({ success: true });
	}
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
	res.json({ success: true, user });
}

exports.getCollege = (req, res) => {
	College.find({}).distinct('name')
		.then(college => {
			res.status(200).json({ college, success: true });
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ success: false })
		});
}

const getFormattedDateAndTime = (dateString) => {
	let date = new Date(dateString);
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	let finalMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
	let strTime = hours + ':' + finalMinutes + ' ' + ampm;
	let currentDate = date.getDate();
	let month = date.toLocaleString('default', { month: 'short' });
	// let year = date.getFullYear();
	dateString = currentDate + ' ' + month;
	return [dateString, strTime];
}

exports.getExcelLogs = async (req, res) => {
	let workbook = new excel.Workbook();
	let worksheet = workbook.addWorksheet('Sheet 1');
	let allTickets = await Ticket.find({})
		.populate('user_id event');
	let details = ['Name', 'E-mail', 'Phone', 'College', 'Csi/Non-Csi', 'Event', 'Time', 'Date'];
	for (let i = 0; i < details.length; i++) {
		worksheet.cell(1, i + 1)
			.string(details[i]);
	}
	for (let i = 2; i <= allTickets.length + 1; i++) {
		try {
			worksheet.cell(i, 1)
				.string(allTickets[i - 1].user_id.name);
		} catch (err) { }
		try {
			worksheet.cell(i, 2)
				.string(allTickets[i - 1].user_id.contact.email);
		} catch (err) { }
		try {
			worksheet.cell(i, 3)
				.string(allTickets[i - 1].user_id.contact.phone);
		} catch (err) { }
		try {
			worksheet.cell(i, 4)
				.string(allTickets[i - 1].user_id.college.name);
		} catch (err) { }
		try {
			worksheet.cell(i, 5)
				.bool((allTickets[i - 1].user_id.csi_member))
		} catch (err) { }
		try {
			worksheet.cell(i, 6)
				.string(allTickets[i - 1].event.name);
		} catch (err) { }
		try {
			worksheet.cell(i, 7)
				.string(getFormattedDateAndTime(allTickets[i - 1].date)[1]);
		} catch (err) { }
		try {
			worksheet.cell(i, 8)
				.string(getFormattedDateAndTime(allTickets[i - 1].date)[0]);
		} catch (err) { }
	}
	workbook.write('logs.xlsx', err => {
		if (err) {
			res.status(503).json({ success: false, error: err });
		} else {
			res.download('./logs.xlsx');
		}
	});
}