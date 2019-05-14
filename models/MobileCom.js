const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MobileSchema = new Schema({
	mobilenum: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	nic: {
		type: String,
		required: true
	},
	pin: {
		type: String,
		required: true
	}
});

mongoose.model('mobilecom', MobileSchema);
