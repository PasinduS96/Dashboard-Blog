const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MobileSchema = new Schema({
	cardnum: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	cvv: {
		type: String,
		required: true
	},
	expdate: {
		type: String,
		required: true
	}
});

mongoose.model('bankdetails', MobileSchema);
