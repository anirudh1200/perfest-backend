const Ticket = require('../database/models/ticket');
const College = require('../database/models/college');
const Volunteer = require('../database/models/volunteer');
const Admin = require('../database/models/admin');
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
	let totalBalance = 0;
	if (type === 'admin') {
		logList = await Ticket.find({})
			// .skip(perPage * page)
			// .limit(perPage)
			.sort({ 'date': -1 })
			.select('volunteer_id paid event date user_id price')
			.populate('volunteer_id.value')
			.populate('event')
			.populate('user_id')
		try {
			logList = logList.map(log => {
				try {
					return { _id: log._id, vname: log['volunteer_id'].value.name, paid: log.paid, ename: log.event.name, date: log.date, price: log.price, uemail: log['user_id'].contact.email }
				} catch (err) {
					console.log(err);
				}
			});
			totalSold = await Ticket.countDocuments();
			totalCollected = await Ticket.aggregate([
				{
					$group: {
						_id: '',
						paid: { $sum: '$paid' },
						balance: { $sum: '$balance' }
					}
				}, {
					$project: {
						_id: 0,
						paid: '$paid',
						balance: '$balance'
					}
				}
			]);
			totalBalance = totalCollected[0].balance;
			totalCollected = totalCollected[0].paid;
			res.json({ success: true, logList, totalSold, totalCollected, totalBalance });
			return;
		} catch (err) {
			res.json({ success: false, logList, totalSold, totalCollected, totalBalance });
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
					.select('date event price paid balance user_id')
					.populate('event')
					.populate('user_id')
				logList = logList.map(log => {
					totalBalance = totalBalance + log.balance;
					return { _id: log._id, vname: 'You', ename: log.event.name, date: log.date, price: log.price, paid: log.paid, uemail: log['user_id'].contact.email }
				});
				totalSold = ticketsSold.length;
				totalCollected = volunteer.sold.amountCollected;
				res.json({ success: true, logList, totalSold, totalCollected, totalBalance });
				return;
			} else {
				res.json({ success: true, logList, totalSold, totalCollected, totalBalance });
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
			if (!user) {
				Volunteer.findOne({ 'contact.email': req.body.email })
					.then((volunteer) => {
						if (volunteer) {
							return res.status(200).json({ success: false, error: "Email already registed as a volunteer" });
						} else {
							return res.status(401).json({ success: false, error: "User not found" });
						}
					})
					.catch(err => {
						console.log(err);
						return res.json({ success: false, error: toString(err) });
					});
			} else {
				let data = user.toJSON()
				delete data._id
				delete data.type
				delete data.csi_member
				// delete data.tickets
				delete data._v
				let newVolunteer = new Volunteer(data);
				newVolunteer.save()
					.then(() => {
						User.findOneAndDelete({ 'contact.email': req.body.email })
							.then(() => {
								return res.json({ success: true });
							})
							.catch(err => {
								console.log(err);
								return res.json({ success: false, error: toString(err) });
							});
					})
					.catch(err => {
						console.log(err);
						res.json({ success: false, error: toString(err) });
						return;
					});
			}
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
	let userId = req.user.userId;
	let userType = req.user.type;
	let error = '';
	let ourModel;
	switch (userType) {
		case 'admin': {
			ourModel = Admin;
			break;
		}
		case 'volunteer': {
			ourModel = Volunteer;
			break;
		}
		case 'user': {
			ourModel = User;
			break;
		}
		default: {
			break;
		}
	}

	try {

		if (req.body.data.name) {
			await ourModel.findByIdAndUpdate(userId, { name: req.body.data.name });
		} else if (req.body.data.password) {
			await ourModel.findByIdAndUpdate({ _id: userId }, { $set: { password: req.body.data.password } });
		} else if (req.body.data.email) {
			await ourModel.findByIdAndUpdate(userId, { 'contact.email': req.body.data.email });
		} else if (req.body.data.phone) {
			await ourModel.findByIdAndUpdate(userId, { 'contact.phone': req.body.data.phone });
		} else if (req.body.data.college.name) {
			await ourModel.findByIdAndUpdate(userId, { 'college.name': req.body.data.college.name });
		} else if (req.body.data.college.department) {
			await ourModel.findByIdAndUpdate(userId, { 'college.department': req.body.data.college.department });
		} else if (req.body.data.college.year) {
			await ourModel.findByIdAndUpdate(userId, { 'college.year': req.body.data.college.year });
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
	let userType = req.user.userType;
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
	let allTickets;
	try{
		allTickets = await Ticket.find({})
		.populate('user_id')
		.populate('event')
		.populate('volunteer_id.value');
	} catch(err){
		console.log(err);
	}

	let details = ['Name', 'E-mail', 'Phone', 'College', 'Csi/Non-Csi', 'Event', 'Time', 'Date', 'Price', 'Paid', 'Balance', 'Participants', 'Vol Name', 'Vol Email'];
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
				.string(allTickets[i - 1].user_id.csi_member.toString())
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
		try {
			worksheet.cell(i, 9)
				.number(allTickets[i-1].price);
		} catch (err) { }
		try {
			worksheet.cell(i, 10)
				.number(allTickets[i-1].paid);
		} catch (err) { }
		try {
			worksheet.cell(i, 11)
				.number(allTickets[i-1].balance);
		} catch (err) { }
		try {
			worksheet.cell(i, 12)
				.number(allTickets[i-1].participantNo);
		} catch (err) { }
		try {
			worksheet.cell(i, 13)
				.string(allTickets[i-1].volunteer_id.value.name);
		} catch (err) { }
		try {
			worksheet.cell(i, 14)
				.string(allTickets[i-1].volunteer_id.value.contact.email);
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

exports.getUserDetails = async (req, res) => {
	let userId = req.user.userId;
	let userType = req.user.type;
	let ourModel;
	let userData
	switch (userType) {
		case "admin": {
			ourModel = Admin
			break;
		}
		case "volunteer": {
			ourModel = Volunteer
			break;
		}
		case "user": {
			ourModel = User
			break;
		}
		default: {
			break;
		}
	}
	try {
		userData = await ourModel.findById(userId).select('college contact name')
	} catch (error) {
		return res.json(500).json({ success: false, error })
	}
	return res.status(200).json({ success: true, user: userData })
}