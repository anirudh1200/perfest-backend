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
			unique: true
		},
		phone: {
			type: String,
			unique: true
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
	// anonymous->false, user->true
	type: {
		type: Boolean,
		required: True,
		default: false
	},
});

module.exports = mongoose('User', userSchema);