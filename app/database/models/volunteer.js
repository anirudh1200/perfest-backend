const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: true
	},
	password: {
		type: String,
		default: 'd'
	},
	contact: {
		email: {
			type: String,
			unique: true,
			required: true
		},
		phone: {
			type: String,
			// unique: true,
			// required: true
		},
	},
	college: {
		name: {
			type: String,
			default: null
		},
		department: {
			type: String,
			default: null
		},
		year: {
			type: String,
			default: null
		},
	},
	events: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event'
	}],
	sold: {
		ticket: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Ticket'
			}],
		amountCollected: {
			type: Number,
			default: 0
		},
	}
});

module.exports = mongoose.model('Volunteer', volunteerSchema);