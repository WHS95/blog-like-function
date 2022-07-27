//몽구스 모듈을 가져온다.
const mongoose = require("mongoose");

//new가 붙음으로써 함수가 아니라 Class로 인식
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

//Comment라는 이름을 가지며,위 스키마를 가진 모듈을 생성하겠다.
module.exports = mongoose.model("Comment", commentSchema);
