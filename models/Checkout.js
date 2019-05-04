const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CheckoutSchema = new Schema({
	destination: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true
	},
	total: {
		type: String,
		required: true
	},
	discount: {
		type: String,
		required: true
	},
	count: {
		type: String,
		required: true
	},
	bdate: {
		type: String,
		required: true
	},
	card: {
		type: String,
		required: false
	},
	cvv: {
		type: String,
		required: false
	},
	expdate: {
		type: String,
		required: false
	},
	holder: {
		type: String,
		required: false
	},
	pin: {
		type: String,
		required: false
	},
	type: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('checkout', CheckoutSchema);
