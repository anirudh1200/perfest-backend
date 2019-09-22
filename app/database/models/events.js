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
	cost_CSI: {
		cost_1: Number,
		cost_2: Number,
		cost_4: Number,
	},
	cost_nonCSI: {
		cost_1: Number,
		cost_2: Number,
		cost_4: Number,
	},
	volunteers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	image: {
		type: String,
		required: true
	},
	venue: {
		type: String,
		required: true
	},
	duration: {
		type: Number,
		default: 1
	}
});

module.exports = mongoose.model('Event', eventSchema);