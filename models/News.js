const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  news: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  urlToImage: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("articles", NewsSchema);
