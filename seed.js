// Dummy data for development
// Please update this if schema is changed
// Or you want to add more data and different cases
const mongoose = require('mongoose'),
	Admin = require('./app/database/models/admin'),
	Event = require('./app/database/models/events'),
	Ticket = require('./app/database/models/ticket'),
	User = require('./app/database/models/user'),
	Volunteers = require('./app/database/models/volunteer');

let adminData = [
	{
		name: 'Admin1',
		password: 'encrypted',
		contact: {
			email: 'admin1@abc.com',
			phone: '1211xxxxxx'
		},
		college: {
			name: 'college1',
			department: 'cs',
			year: 'F.E'
		}
	},
	{
		name: 'Admin2',
		password: 'strongPassword',
		contact: {
			email: 'admin2@abcd.com',
			phone: '9999xxxxxx'
		},
		college: {
			name: 'college2',
			department: 'extc',
			year: 'S.E'
		}
	}
]

let eventData = [
	{
		name: 'Code Arena',
		description: 'A coding game',
		date: new Date(),
		cost_1: 30,
		cost_2: 50,
		cost_4: 80,
		volunteers: [],
		image: './data/images/event1.jpg',
		venue: 'mumbai'
	},
	{
		name: 'Highway to Heaven',
		description: 'A coding game',
		date: new Date(),
		cost_1: 30,
		cost_2: 50,
		cost_4: 80,
		volunteers: [],
		image: './data/images/event1.jpg',
		venue: 'mumbai'
	},
	{
		name: 'Ramraoadik epic 3.0',
		description: 'A coding game',
		date: new Date(),
		cost_1: 19,
		cost_2: 29,
		cost_4: 89,
		volunteers: [],
		image: './data/images/event1.jpg',
		venue: 'mumbai'
	}
]

let userData = [
	{
		name: 'user1',
		password: 'pass',
		contact: {
			email: 'user1@abc.com',
			phone: '12121212'
		},
		college: {
			name: 'college4',
			department: 'IT',
			year: 'T.E'
		},
		type: true,
		csi_member: true
	},
	{
		name: 'user2',
		password: 'pass',
		contact: {
			phone: '9865xxxxxx',
			email:'use222@a.c'
		},
		college: {
			name: 'college4',
			department: 'EXTC',
			year: 'F.E'
		},
		type: true,
		csi_member: false
	},
	{
		name: 'user3',
		password: 'pass',
		contact: {
			email: 'user3@abc.com',
			phone: 99999999
		},
		college: {
			name: 'college4',
			department: 'CS',
			year: 'B.E'
		},
		type: true,
		csi_member: false
	},
	{
		name: 'user4',
		contact: {
			email: 'user4@abc.com'
		},
		college: {
			name: 'college4',
			department: 'CS',
			year: 'B.E'
		},
		type: true,
		csi_member: false
	},
	{
		name: 'user5',
		contact: {
			email: 'user5@abc.com'
		},
		type: false,
	},
]

let ticketData = [
	{
		user_id: null,
		url: 'abcd',
		secretString: 'secret',
		event: [],
		volunteer_id: null,
		price: 30,
		paid: 15,
		participantNo: 1
	},
	{
		user_id: null,
		url: 'abcde',
		secretString: 'secret2',
		event: [],
		volunteer_id: null,
		price: 30,
		paid: 30,
		participantNo: 1
	},
]

let volunteerData = [
	{
		name: 'Vol1',
		password: 'encrypted',
		contact: {
			email: 'vol11@abc.com',
			phone: '1211xxxxxx'
		},
		college: {
			name: 'college1',
			department: 'cs',
			year: 'F.E'
		},
		sold: {
			ticket: [],
			amountCollected: 0
		}
	},
	{
		name: 'Vol2',
		password: 'encrypted',
		contact: {
			email: 'vol21@abc.com',
			phone: '12111xxxxx'
		},
		college: {
			name: 'college1',
			department: 'cs',
			year: 'F.E'
		},
		sold: {
			ticket: [],
			amountCollected: 30
		}
	},
	{
		name: 'Vol3',
		password: 'eencrypted',
		contact: {
			email: 'vol213@abc.com',
			phone: '121111xxxx'
		},
		college: {
			name: 'college1',
			department: 'cs',
			year: 'F.E'
		},
	},
]

let clearDB = async () => {
	try {
		await Admin.deleteMany();
		console.log('Deleted Admin Collection');
		await Event.deleteMany();
		console.log('Deleted Event Collection');
		await Ticket.deleteMany();
		console.log('Deleted Ticket Collection');
		await User.deleteMany();
		console.log('Deleted User Collection');
		await Volunteers.deleteMany();
		console.log('Deleted Volunteer Collection');
	} catch (err) {
		throw new Error(err);
	}
}

let insertAdmin = async () => {
	let finalArray = adminData.map(async admin => {
		let newAdmin = new Admin(admin);
		try {
			return await newAdmin.save();
		} catch (err) {
			console.log(err);
			return;
		}
	});
	await Promise.all(finalArray);
};

let insertVolunteers = async () => {
	let finalArray = volunteerData.map(async volunteer => {
		let newVolunteer = new Volunteers(volunteer);
		try {
			return await newVolunteer.save();
		} catch (err) {
			return;
		}
	});
	await Promise.all(finalArray);
};

let insertUsers = async () => {
	let finalArray = userData.map(async user => {
		let newUser = new User(user);
		try {
			return await newUser.save();
		} catch (err) {
			console.log(err);
			return;
		}
	});
	await Promise.all(finalArray);
};

let insertEvents = async (volunterList) => {
	let finalArray = eventData.map(async (event, i) => {
		event.volunteers.push(volunterList[i]['_id']);
		let newEvent = new Event(event);
		try {
			return await newEvent.save();
		} catch (err) {
			console.log(err);
			return;
		}
	});
	await Promise.all(finalArray);
}

let insertTickets = async (volunterList, userList, eventList) => {
	let finalArray = ticketData.map(async (ticket, i) => {
		ticket['user_id'] = userList[i]['_id'];
		ticket['volunteer_id'] = volunterList[i]['_id'];
		ticket.event = eventList[i]['_id'];
		let newTicket = new Ticket(ticket);
		try {
			return await newTicket.save();
		} catch (err) {
			console.log(err);
			return;
		}
	});
	await Promise.all(finalArray);
}

seedDB = async () => {
	await clearDB();
	await insertAdmin();
	console.log('Inserted Admins');
	await insertVolunteers();
	console.log('Inserted Volunteers');
	let volunterList = await Volunteers.find();
	await insertUsers();
	console.log('Inserted Users');
	let userList = await User.find({});
	await insertEvents(volunterList);
	console.log('Inserted Events');
	let eventList = await Event.find();
	await insertTickets(volunterList, userList, eventList);
	console.log('Inserted Tickets');
}

module.exports = seedDB;
