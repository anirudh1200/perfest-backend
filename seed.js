// Dummy data for development
const mongoose = require('mongoose'),
	Admin = require('./app/database/models/admin'),
	Events = require('./app/database/models/events'),
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
		image: './data/images/event1.jpg',
		venue: 'mumbai'
	},
	{
		name: 'Code Arena',
		description: 'A coding game',
		date: new Date(),
		cost_1: 30,
		cost_2: 50,
		cost_4: 80,
		image: './data/images/event1.jpg',
		venue: 'mumbai'
	}
]

let userData = [
	{
		name: 'user1',
		password: 'pass',
		contact: {
			email: 'user1@abc.com'
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
			phone: '9865xxxxxx'
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
			email: 'user3@abc.com'
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
		user_id: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
		url: 'abcd',
		event: [
			mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
			mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
		],
		volunteer_id: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
		price: 30,
		paid: true,
		participantNo: 1
	},
	{
		user_id: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
		url: 'abcde',
		event: [
			mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
			mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
		],
		volunteer_id: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
		price: 30,
		paid: true,
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
			ticket: [
				mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
				mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
			],
			amountCollected: 50
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
			ticket: [
				mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
			],
			amountCollected: 30
		}
	},
]

seedDB = async() => {
	try{
		await Admin.deleteMany()
		console.log('Deleted Admin Collection')
		await Events.deleteMany()
		console.log('Deleted Events Collection')
		await Ticket.deleteMany()
		console.log('Deleted Ticket Collection')
		await User.deleteMany()
		console.log('Deleted User Collection')
		await Volunteers.deleteMany()
		console.log('Deleted Volunteer Collection')
	} catch(err){
		console.log(err);
	}
	adminData.forEach(admin => {
		let newAdmin = new Admin(admin);
		newAdmin.save()
			.catch(console.log);
	});
	eventData.forEach(event => {
		let newEvent = new Events(event);
		newEvent.save()
			.catch(console.log);
	});
	ticketData.forEach(ticket => {
		let newTicket = new Ticket(ticket);
		newTicket.save()
			.catch(console.log);
	});
	userData.forEach(user => {
		let newUser = new User(user);
		newUser.save()
			.catch(console.log);
	});
	volunteerData.forEach(volunteer => {
		let newVolunteer = new Volunteers(volunteer);
		newVolunteer.save()
			.catch(console.log);
	});
}

module.exports = seedDB;