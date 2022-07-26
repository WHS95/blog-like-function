const express = require("express");
const connect = require("./schemas");
const app = express();
const port = 5000;

connect();

app.use(express.json());

const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");

app.get("/", (req, res) => {
  res.send("Welcome My Blog");
});

app.use("/", [postRouter, commentRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
