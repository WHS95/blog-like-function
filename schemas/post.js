const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  contents: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: Date,
    default: Date.now,
    required: true,
    unique: true,
  },
  password: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
