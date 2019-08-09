const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	// set unique
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
		department: {
			type: String,
			default: null
		},
		year: {
			type: String,
			default: null
		},
	},
});

module.exports = mongoose.model('Admin', adminSchema);