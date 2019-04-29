const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketsSchema = new Schema({
	destination: {
		type: String,
		required: true
	},
	duration: {
		type: String,
		required: true
	},
	// user: {
	// 	type: String,
	// 	required: true
	// },
	price: {
		type: Number,
		required: true
	},
	time: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	},
	station: {
		type: String,
		required: true
	}
});

mongoose.model('logcontent', TicketsSchema);
