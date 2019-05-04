const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const popupS = require('popups');
const router = express.Router();

require('../models/UserDetails');
const User = mongoose.model('users');

//Route For Login
router.get('/login', (req, res) => {
	res.render('users/loginForm');
});

router.get('/register', (req, res) => {
	res.render('users/regForm');
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash: true
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'User Succesfully Logged Out, You Must Re-login For Further Actions');
	res.redirect('/user/login');
});

router.post('/register', (req, res) => {
	let error1 = null;
	let error2 = null;
	let error3 = null;

	if (req.body.password != req.body.password2) {
		error1 = 'Passwords are not matching';
	}

	if (req.body.password.length < 8) {
		error2 = 'Passwords length poor, Enter at least 8 characters';
	}

	if ((error1 != null && error1.length > 0) || (error2 != null && error2.length > 0)) {
		res.render('users/regForm', {
			error1: error1,
			error2: error2,
			error3: error3,
			name: req.body.name,
			email: req.body.email,
			nic: req.body.nic,
			phone: req.body.phone,
			password: req.body.password,
			password2: req.body.password2
		});

		console.log('render 01');
	} else {
		User.findOne({ email: req.body.email }).then((user) => {
			if (user) {
				error3 = 'Email Alredy Used! Please Try Another Email! ';
				res.render('users/regForm', {
					error1: error1,
					error2: error2,
					error3: error3,
					name: req.body.name,
					email: req.body.email,
					nic: req.body.nic,
					phone: req.body.phone,
					password: req.body.password,
					password2: req.body.password2
				});
			} else {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					nic: req.body.nic,
					phone: req.body.phone,
					gender: req.body.gender,
					password: req.body.password,
					type: req.body.type
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then((user) => {
								req.flash(
									'success_msg',
									'Congratulations! You are now registered! Shall we start bookings? Oky! Please Login! '
								);
								res.redirect('/user/login');
							})
							.catch((err) => {
								console.log(err);
								return;
							});
					});
				});
			}
		});
	}
});

module.exports = router;
