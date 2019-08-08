const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	cost_1: Number,
	cost_2: Number,
	cost_4: Number,
	volunteers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	image: {
		type: String,
		required: true
	}
});

module.exports = mongoose('Event', eventSchema);