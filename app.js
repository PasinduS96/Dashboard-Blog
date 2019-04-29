const express = require('express');

const app = express();

const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

require('./models/Tickets');
const TicketContent = mongoose.model('logcontent');

const content = require('./routes/content');
const users = require('./routes/user_details');

mongoose.Promise = global.Promise;
mongoose
	.connect('mongodb://localhost/thinkpad-app', { useNewUrlParser: true })
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Global variables
app.use(function(req, res, next) {
	res.locals.pass_err1 = false;
	next();
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.use('/contentlogs', content);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
	console.log(`Server Running At Port ${port}`);
});
