//express를 사용하겠다.
const express = require("express");
//express가 제공하는 라우트 기능을 사용하겠다.
const router = express.Router();
//comment 스키마를 참고하겠다.
const Comment = require("../schemas/comment");
//몽구스 모듈을 사용하겠다.
const mongoose = require("mongoose");


//댓글 목록 조회
router.get("/comments/:articleId", async (req, res) => {
  ///comments/:articleId위 url에서 articleId부분에 들어간 값을 PostId로 선언하겠다.
  const PostId = req.params.articleId;
  //db 컬렉션인 Comment에 들어있는 데이터중에 Url에서 가져온 값과 데이터에 postid의 키값이 같을 경우에
  //찾아서Comments에 반영을 할 것이며 그 후  
  const Comments = await Comment.find(
    { postid: PostId },
    { _id: 0, commentid: 1, name: 1, comment: 1, time: 1 }
  ).sort({ time: -1 });
  
  //배열로 넘어오기에 만약 들어온 Conmments에 데이터가 없다면 0(false)을 출력할것이다.
  //그렇기에 !을 이용하여 없는 경우에 응답값을 만들어준다.
  if (!Comments.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글이 없습니다.",
    });
  }
  //JS shorthand property(객체 초기자)
  res.json({
    Comments,
  });
});

//댓글 작성
router.post("/comments/:articappleId", async (req, res) => {
  const postId = req.params.articleId;
  const { name, comment, time, password } = req.body;
  const id = new mongoose.Types.ObjectId();
  if (name === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "이름을 입력해주세요",
    });
  
  } else if (comment === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글내용을 입력해주세요",
    });
  } else if (password === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요",
    });
  }

  await Comment.create({
    commentid: id,
    name,
    comment,
    time,
    postid: postId,
    password,
  });
  res.json({ Message: "작성 완료" });
});

//댓글 수정
router.put("/comments/:commentId", async (req, res) => {
  const comId = req.params.commentId;
  const { name, comment, password } = req.body;

  if (comment === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글내용을 입력해주세요",
    });
  } else if (password === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요",
    });
  }

  const commentData = await Comment.find({ commentid: comId });
  const commentPws = commentData.map((pass) => pass.password).join() * 1;

  if (password !== commentPws) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치 하지 않습니다!",
    });
  }

  await Comment.updateOne({ commentid: comId }, { $set: { name, comment } });
  res.json({ Message: "수정 완료" });
});

//댓글 삭제
router.delete("/comments/:commentId", async (req, res) => {
  const comId = req.params.commentId;
  const { password } = req.body;
  if (password === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요",
    });
  }

  const commentData = await Comment.find({ commentid: comId });
  const commentPws = commentData.map((pass) => pass.password).join() * 1;

  if (password !== commentPws) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치 하지 않습니다!",
    });
  } else {
    await Comment.deleteOne({ commentid: comId });
    return res.status(200).json({
      Message: "댓글 삭제 완료",
    });
  }
});

//위에서 사용되어진 라우터들의 기능을 모아서 module로써 내보내겠다.
module.exports = router;
