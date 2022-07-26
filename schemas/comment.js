const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  comment: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
    required: true,
    unique: true,
  },
  postid: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
