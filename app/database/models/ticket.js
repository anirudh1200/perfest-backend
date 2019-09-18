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
	secretString:{
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
		ref: 'Event',
		required: true
	},
	volunteer_id: {
		type: mongoose.Schema.Types.ObjectId,
<<<<<<< Updated upstream
		ref: 'Admin',
=======
		refPath: 'onModel',
>>>>>>> Stashed changes
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
	balance: {
		type: Number
	},
	participantNo: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		default: new Date()
	},
	onModel:{
		type: String,
		require : true,
		enum : ['Admin','Volunteer']
	}
});

ticketSchema.pre('save', function(next) {
	if(this.price - this.paid !== 0){
		this.balance = this.price - this.paid
	} else {
		this.balance = null;
	}
	next();
});

module.exports = mongoose.model('Ticket', ticketSchema);