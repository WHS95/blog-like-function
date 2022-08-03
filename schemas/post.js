const mongoose = require("mongoose");
require("dotenv").config()
const postSchema = new mongoose.Schema({
  userId:String,
  nickname:String,
  title:String,
  contents:String,
  time: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Post", postSchema);

