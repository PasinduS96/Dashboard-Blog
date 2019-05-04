const express = require('express');

const app = express();

const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const webpush = require('web-push');
const flash = require('connect-flash');

require('./models/Tickets');
const TicketContent = mongoose.model('logcontent');

const content = require('./routes/content');
const users = require('./routes/user_details');

mongoose.Promise = global.Promise;
mongoose
	.connect('mongodb://localhost/thinkpad-app', {
		useNewUrlParser: true
	})
	.then(console.log('MongoDB Connected Successfully!!'))
	.catch((err) => console.log(err));

app.engine(
	'handlebars',
	exphbs({
		defaultLayout: 'main'
	})
);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./config/passport_validation')(passport);

app.use(
	session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.use('/contentlogs', content);
app.use('/user', users);

const port = 5000;

app.listen(port, () => {
	console.log(`Server Running At Port ${port}`);
});
