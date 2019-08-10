const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		default: null
	},
	password: {
		type: String,
		default: null
	},
	contact: {
		email: {
			type: String,
			unique: true,
			sparse: true
		},
		phone: {
			type: String,
			unique: true,
			sparse: true
		},
	},
	college: {
		name: {
			type: String,
			default: null
		},
		// For techfest csi
		department: {
			type: String,
			default: null
		},
		year: {
			type: String,
			default: null
		},
	},
	// anonymous->false, user->true
	type: {
		type: Boolean,
		default: false
	},
	csi_member: {
		type: Boolean,
		default: false
	},
	tickets: {
		type: mongoose.Schema.Types.ObjectId,
		default: null
	}
});

module.exports = mongoose.model('User', userSchema);