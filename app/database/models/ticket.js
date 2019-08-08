const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	url: {
		type: String,
		required: true,
		unique: true
	},
	valid: {
		type: Boolean,
		default: true
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Events',
		required: true
	},
	volunteer_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	paid: {
		type: Number,
		required: true
	},
	// Balance = price-paid automatically to be done
	balance: {
		type: Number
	},
	participantNo: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Ticket', ticketSchema);