const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { checkAuthentication } = require('../authentication/authentication');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

require('../models/Tickets');
const TicketContent = mongoose.model('logcontent');

require('../models/Checkout');
const Check = mongoose.model('checkout');

require('../models/MobileCom');
const MobileComGate = mongoose.model('mobilecom');

require('../models/Bank');
const BankGate = mongoose.model('bankdetails');

router.get('/', checkAuthentication, (req, res) => {
	TicketContent.find({}).sort({}).then((content) => {
		res.render('contentlogs/index', {
			content: content
		});
	});
});

router.get('/checkout/:id', (req, res) => {
	TicketContent.findOne({
		_id: req.params.id
	}).then((data) => {
		res.render('checkout/checkout', {
			data: data
		});
	});
});

router.post('/checkout', (req, res) => {
	let total = req.body.price * req.body.tickets;
	let discount;
	let type = 'Credit Card Payment';

	if (req.body.mobilepay) {
		type = 'Mobile Payment';
		console.log(type);
	}

	if (req.user.type) {
		discount = total * 0.2;
		total = total - discount;
	}

	if (!req.user.type) {
		discount = 0.0;
	}

	const newUser = new Check({
		user: req.user.name,
		destination: req.body.des,
		email: req.user.email,
		total: total,
		discount: discount,
		count: req.body.tickets,
		bdate: req.body.day,
		card: req.body.creditcard,
		cvv: req.body.cvv,
		expdate: req.body.expdate,
		holder: req.body.holder,
		pin: req.body.pin,
		type: type
	});

	if (type == 'Mobile Payment') {
		MobileComGate.findOne({ mobilenum: req.user.phone }).sort({}).then((results) => {
			if (results.pin === req.body.pin) {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.pin, salt, (err, hash) => {
						newUser.pin = hash;
						newUser
							.save()
							.then((user) => {
								if (newUser.count == 1) {
									req.flash(
										'success_msg',
										`Mobile Payment Successful! You Booked ${newUser.count} Ticket To Travel For ${newUser.destination} on ${newUser.bdate}`
									);
								} else {
									req.flash(
										'success_msg',
										`Mobile Payment Successful! You Booked ${newUser.count} Tickets To Travel For ${newUser.destination} on ${newUser.bdate}`
									);
								}

								let transporter = nodemailer.createTransport({
									service: 'gmail',
									auth: {
										user: 'trainticketslk@gmail.com',
										pass: 'Train1234'
									}
								});

								let mailOptions = {
									from: 'trainticketslk@gmail.com',
									to: newUser.email,
									subject: 'Booking Confirmed - TrainTicketsLK',
									html: `<h2>Hello, ${newUser.user}!</h2>
								<p>You were successfully booked <b>${newUser.count}</b> Tickets to travel ${newUser.destination}</p>
								<br>
								<h3>Ticket Details</h3>
								<p><b>Total Payment :</b> ${newUser.total} </p>
								<p><b>Discount :</b> ${newUser.discount} </p>
								<p><b>Booking Date :</b> ${newUser.bdate} </p>
								<p><b>Station :</b> ${req.body.station} </p>
								<p><b>Time :</b> ${req.body.time} </p>
								<br>
								<p>Please come to station 15 miniutes before given time of ticket, Enjoy Journy!</p>
								<br>
								<p>Thank You,</p>
								<p>Regards,</p>
								<p>TrainTicketsLK</p> `
								};

								transporter.sendMail(mailOptions, function(error, info) {
									if (error) {
										console.log(error);
									} else {
										console.log('Email sent: ' + info.response);
									}
								});

								const accountSid = 'AC3fe09155a6f046d48d721f4e4e588d7f';
								const authToken = 'fa5ff7ac4bc731f778825d156dfa6e36';

								const client = require('twilio')(accountSid, authToken);

								client.messages.create(
									{
										to: req.user.phone,
										from: '+12407536730',
										body: `Hello ${newUser.user}, Your Booking Was Scuucessful and You Booked ${newUser.count} for ${newUser.destination}`
									},
									(err, message) => {
										console.log(err);
									}
								);

								console.log('Sms sent');

								res.redirect('/contentlogs');
							})
							.catch((err) => {
								console.log(err);
								return;
							});
					});
				});
			} else {
				req.flash('error', 'Mobile Payment Can Not Proceed');
			}
		});
	}

	if (type == 'Credit Card Payment') {
		BankGate.findOne({ cardnum: req.body.creditcard }).sort({}).then((results) => {
			if (results.cvv === req.body.cvv) {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.card, salt, (err, hash) => {
						newUser.card = hash;
						newUser
							.save()
							.then((user) => {
								if (newUser.count == 1) {
									req.flash(
										'success_msg',
										`Credit Card Payment Successful! You Booked ${newUser.count} Ticket To Travel For ${newUser.destination} on ${newUser.bdate}`
									);
								} else {
									req.flash(
										'success_msg',
										`Credit Card Payment Successful! You Booked ${newUser.count} Tickets To Travel For ${newUser.destination} on ${newUser.bdate}`
									);
								}

								let transporter = nodemailer.createTransport({
									service: 'gmail',
									auth: {
										user: 'trainticketslk@gmail.com',
										pass: 'Train1234'
									}
								});

								let mailOptions = {
									from: 'trainticketslk@gmail.com',
									to: newUser.email,
									subject: 'Booking Confirmed - TrainTicketsLK',
									html: `<h2>Hello, ${newUser.user}!</h2>
							<p>You were successfully booked <b>${newUser.count}</b> Tickets to travel ${newUser.destination}</p>
							<br>
							<h3>Ticket Details</h3>
							<p><b>Total Payment :</b> ${newUser.total} </p>
							<p><b>Discount :</b> ${newUser.discount} </p>
							<p><b>Booking Date :</b> ${newUser.bdate} </p>
							<p><b>Station :</b> ${req.body.station} </p>
							<p><b>Time :</b> ${req.body.time} </p>
							<br>
							<p>Please come to station 15 miniutes before given time of ticket, Enjoy Journy!</p>
							<br>
							<p>Thank You,</p>
							<p>Regards,</p>
							<p>TrainTicketsLK</p> `
								};

								transporter.sendMail(mailOptions, function(error, info) {
									if (error) {
										console.log(error);
									} else {
										console.log('Email sent: ' + info.response);
									}
								});

								res.redirect('/contentlogs');
							})
							.catch((err) => {
								console.log(err);
								return;
							});
					});
				});
			} else {
				req.flash('error', 'Card Payment Can Not Proceed');
			}
		});
	}
});

module.exports = router;
