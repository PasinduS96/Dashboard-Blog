const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const router = express.Router();
const { checkAuthentication } = require("../authentication/authentication");

const firebase = require("firebase");
const fs = require("fs");

require("../models/News");
const News = mongoose.model("articles");

const firebaseConfig = {
  apiKey: "AIzaSyCpatAk1VPW-OrG4DHbjdXL91Iy4PzE-wc",
  authDomain: "mobile-app-dashboard-01.firebaseapp.com",
  databaseURL: "https://mobile-app-dashboard-01.firebaseio.com",
  projectId: "mobile-app-dashboard-01",
  storageBucket: "mobile-app-dashboard-01.appspot.com",
  messagingSenderId: "132632785931",
  appId: "1:132632785931:web:7120791c48e0097fda830e",
  measurementId: "G-NVNNLDG478"
};

firebase.initializeApp(firebaseConfig);

const writeUserData = (title, description) => {
  firebase
    .database()
    .ref("post/" + title)
    .set({
      description: description
    });
};

const deleteFile = path => {
  let realPath = path.slice(21, path.length);
  fs.unlink("." + realPath, err => {
    if (err) {
      console.log(err);
    }
  });
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/svg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage });

router.get("/add", checkAuthentication, (req, res) => {
  res.render("news/add");
});

router.get("/edit/:id", checkAuthentication, (req, res) => {
  News.findOne({ _id: req.params.id }).then(news => {
    res.render("news/edit", { news: news });
  });
});

router.post("/:id", checkAuthentication, (req, res) => {
  News.findOne({
    _id: req.params.id
  }).then(news => {
    news.title = req.body.title;
    news.news = req.body.news;
    news.category = req.body.category;
    news.description = req.body.description;

    news.save().then(news => {
      req.flash("success_msg", "Record Successfuly Updated");
      res.redirect("/home");
    });
  });
});

router.get("/deleteNews/:id", (req, res, next) => {
  News.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      deleteFile(data.urlToImage);
      req.flash("success_msg", "Record Successfuly Deleted");
      res.redirect("/home");
    }
  });
});

router.post(
  "/newss/addNews",
  upload.single("urlToImage"),
  checkAuthentication,
  (req, res) => {
    let errors = [];

    if (!req.body.title) {
      errors.push({ text: "Please Add Titile" });
    }
    if (!req.body.news) {
      errors.push({ text: "Please Provide Details" });
    }
    if (errors.length > 0) {
      res.render("news/add", {
        errors: errors,
        title: req.body.title,
        news: req.body.news,
        description: req.body.description,
        category: req.body.category
      });
    } else {
      console.log(req.file);

      let path = `http://localhost:5000/${req.file.path}`;
      const newNews = new News({
        title: req.body.title,
        news: req.body.news,
        description: req.body.description,
        category: req.body.category,
        urlToImage: path
      });

      newNews
        .save()
        .then(() => {
          writeUserData(req.body.title, req.body.description);
          req.flash("success_msg", "Record Successfuly Added");
          res.redirect("/home");
        })
        .catch(err => {
          console.log(err);
          return;
        });
    }
  }
);

module.exports = router;
