const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

require('../models/Tickets');
const TicketContent = mongoose.model('logcontent');

router.get('/add', (req, res) => {
	res.render('contentlogs/add');
});

router.post('/register', (req, res) => {
	const newUser = {
		title: req.body.title,
		content: req.body.details
	};

	new TicketContent(newUser).save().then((idea) => {
		res.json({ msg: 'Success' });
	});
});

router.get('/', (req, res) => {
	TicketContent.find({}).sort({}).then((content) => {
		res.render('contentlogs/index', {
			content: content
		});
	});
});

module.exports = router;
