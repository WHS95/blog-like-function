const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb+srv://test:sparta@cluster0.l0pgj.mongodb.net/?retryWrites=true&w=majority")
    //27017은 몽고 db의 기본 포트 넘버이다.
    .then(() => console.log('MongoDB conected'))
    .catch(err => console.log(err));
    //서버 연결에 에러 발생시 에러를 출력하기위해 작성
};

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;