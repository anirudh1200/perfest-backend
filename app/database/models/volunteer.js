const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		default: 'd'
	},
	// set unique
	contact: {
		email: {
			type: String,
			unique: true,
			required: true
		},
		phone: {
			type: String,
			unique: true,
			required: true
		},
	},
	college: {
		name: {
			type: String,
			required: true,
			default: 'd'
		},
		department: {
			type: String,
			required: true,
			default: 'd'
		},
		year: {
			type: String,
			required: true,
			default: 'd'
		},
	},
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

module.exports = mongoose('User', userSchema);