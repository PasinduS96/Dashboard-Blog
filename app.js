const express = require("express");

const app = express();

const path = require("path");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const Handlebars = require("handlebars");

const newss = require("./routes/newss");
const users = require("./routes/user_details");
const apis = require("./routes/publicApi");

const {
  allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");
const { checkAuthentication } = require("./authentication/authentication");

require("./models/News");
const News = mongoose.model("articles");

require("dotenv").config();

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/express-app-02", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("MongoDB Connected Successfully!!"))
  .catch(err => console.log(err));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);

app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require("./config/passport_validation")(passport);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  res.render("users/loginForm");
});

// app.get('/about', (req, res) => {
// 	res.render('about');
// });

app.get("/home", checkAuthentication, (req, res) => {
  News.find()
    .sort({ publishedAt: "desc" })
    .then(newses => {
      res.render("index", {
        newses: newses
      });
    });
});

app.use("/news", newss);
app.use("/user", users);
app.use("/api", apis);

app.listen(process.env.PORT, () => {
  console.log(`Server Running At Port ${process.env.PORT}`);
});
