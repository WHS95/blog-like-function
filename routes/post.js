const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth-middlware");
const { Post } = require("../models");

//전체 게시글 목록 조회 ok
router.get("/posts", async (req, res) => {
  const Posts = await Post.findAll({
    attributes: ["postId", "nickname", "contents", "title", "createdAt"],
  });
  if (!Posts.length) {
    return res.json({
      success: false,
      errorMessage: "게시글이 없습니다.",
    });
  }
  res.json({
    Posts,
  });
});

//게시글 작성 ok
router.post("/posts", authorization, async (req, res) => {
  const { title, contents } = req.body;
  if (title === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "제목을 입력해주세요",
    });
  } else if (contents === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "내용을 입력해주세요",
    });
  }
  const { userId } = res.locals.user;
  const { nickname } = res.locals.user;
  const createdPost = new Post({ userId, nickname, title, contents });
  await createdPost.save();
  res.json({ post: createdPost });
});

//게시글 상세 조회 ok
router.get("/posts/:postId", authorization, async (req, res) => {
  const { postId } = req.params;
  const posts = await Post.findByPk(postId);
  if (!posts) {
    return res.json({
      success: false,
      errorMessage: "게시글이 없습니다.",
    });
  }
  res.json({ posts });
});

//게시글 수정 ok
router.put("/posts/:postId", authorization, async (req, res) => {
  const { postId } = req.params;
  const { contents } = req.body;
  const { userId } = res.locals.user;
  const checkedPost = await Post.findByPk(postId);
  if (!checkedPost) {
    return res.status(400).json({
      success: false,
      errorMessage: "존재하지 않는 게시물입니다.",
    });
  }
  const PostUserId = checkedPost.dataValues.userId;
  if (userId != PostUserId) {
    return res.status(400).json({
      success: false,
      errorMessage: "수정할 수 없습니다.",
    });
  } else if (!contents) {
    return res.status(400).json({
      success: false,
      errorMessage: "내용을 입력해주세요",
    });
  }
  checkedPost.update({ contents: contents });
  res.json({ Message: "수정 완료" });
});

//게시글 삭제ok
router.delete("/posts/:postId", authorization, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const checkedPost = await Post.findOne({
    where: { postId: postId },
  });
  if (checkedPost === null) {
    return res.status(400).json({
      success: false,
      errorMessage: "존재하지 않는 게시물입니다.",
    });
  }
  const PostUserId = checkedPost.dataValues.userId;
  if (userId != PostUserId) {
    return res.status(400).json({
      success: false,
      errorMessage: "수정할 수 없는 게시글입니다.",
    });
  }
  Post.destroy({ where: { postId: postId } });
  return res.status(200).json({
    Message: "게시글 삭제 완료",
  });
});

module.exports = router;
