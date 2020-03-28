const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

require("../models/News");
const News = mongoose.model("articles");
require("dotenv").config();

router.get(`/public/:category/${process.env.API_KEY}`, (req, res) => {
  News.find({ category: req.params.category })
    .sort({ publishedAt: "desc" })
    .then(news => {
      res.json(news);
    });
});

module.exports = router;
