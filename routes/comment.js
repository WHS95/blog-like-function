const express = require("express");
const Comment = require("../schemas/comment");
const mongoose = require("mongoose");
const router = express.Router();

//댓글 목록 조회
router.get("/comments/:articleId", async (req, res) => {
  const PostId = req.params.articleId;
  const Comments = await Comment.find(
    { postid: PostId },
    { _id: 0, commentid: 1, name: 1, comment: 1, time: 1 }
  ).sort({ time: -1 });

  if (!Comments.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글이 없습니다.",
    });
  }
  res.json({
    Comments,
  });
});
//댓글 작성
router.post("/comments/:articleId", async (req, res) => {
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

module.exports = router;
