const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	valid: {
		type: Boolean,
		default: true
	}
});

module.exports = mongoose('Ticket', ticketSchema);