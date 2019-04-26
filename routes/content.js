const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

require('../models/Idea');
const Idea = mongoose.model('logcontent');

router.get('/add', (req, res) => {
	res.render('contentlogs/add');
});

router.get('/', (req, res) => {
	res.send('contentlogs');
});

router.post('/', (req, res) => {
	let errors = [];

	if (!req.body.title) {
		errors.push({ text: 'Please Add Titile' });
	}
	if (!req.body.details) {
		errors.push({ text: 'Please Provide Details' });
	}
	if (errors.length > 0) {
		res.render('/add', {
			errors: errors,
			title: req.body.title,
			content: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			content: req.body.details
		};

		new Idea(newUser).save().then((idea) => {
			res.redirect('/contentlogs');
		});
	}
});

module.exports = router;
