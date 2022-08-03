//express 웹 프레임워크를 사용하겠다.
const express = require("express");
const app = express();

//몽고db 위치를 파악
const connect = require("./schemas/db_connection");
const mongoose = require("mongoose");
require("dotenv").config();
const { PORT, MONGODB_URL } = process.env;
//몽고스db 연결
connect();

//json이라는 규격의 body 데이터를 손쉽게 코드에서 사용할수 있게 도와주는 미들웨어
//미들웨어가 들어오요청에 반응하기 위에서 get위에 있어야 한다.
//위에서 아래로 코딩이 진행되기 때문
app.use(express.json());


//라우터가 응답을 받을수 있게 위치를 알려준다.
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const usersRouter = require("./routes/users");
const likeRouter = require("./routes/like");


//'/'경로로 요청이 들어왔다면 보일 반응
app.get("/", (req, res) => {
  res.send("Welcome My Blog");
});


//라우터를 사용하겠다.
app.use("/", [postRouter, commentRouter, usersRouter,likeRouter]);


//서버를 키켰을때의 보일 반응
app.listen(5000, () => {
  console.log(5000, "포트로 서버가 열렸어요!");
});
