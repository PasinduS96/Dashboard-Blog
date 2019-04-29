const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Route For Login
router.get('/login', (req, res) => {
	res.render('users/loginForm');
});

router.get('/register', (req, res) => {
	res.render('users/regForm');
});

router.post('/register', (req, res) => {
	let error1 = null;
	let error2 = null;

	if (req.body.password != req.body.password2) {
		error1 = 'Passwords are not matching';
	}

	if (req.body.password.length < 5) {
		error2 = 'Passwords length poor, Enter at least 4 characters';
	}

	if (error1.length > 0) {
		res.render('users/regForm', {
			error1: error1,
			error2: error2,
			name: req.body.name,
			email: req.body.email,
			nic: req.body.nic,
			phone: req.body.phone,
			password: req.body.password,
			password2: req.body.password2
		});
	} else {
		res.send('passed');
	}
	console.log(res.body);
});

module.exports = router;
