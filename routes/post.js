const express = require("express");
const Post = require("../schemas/post");
const mongoose = require("mongoose");
const router = express.Router();

//전체 게시글 목록 조회
router.get("/posts", async (req, res) => {
  const Posts = await Post.find(
    {},
    { _id: 0, title: 1, name: 1, time: 1, postid: 1 }
  ).sort({ time: -1 });
  if (!Posts.length) {
    return res.json({
      success: false,
      errorMessage: "게시글이 없습니다.",
    });
  }
  res.json({
    Posts: Posts,
  });
});

//게시글 작성
router.post("/posts", async (req, res) => {
  const { name, title, contents, time, password } = req.body;
  const id = new mongoose.Types.ObjectId();

  if (name === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "이름을 입력해주세요",
    });
  } else if (title === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "제목을 입력해주세요",
    });
  } else if (contents === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "내용을 입력해주세요",
    });
  } else if (password === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요",
    });
  }

  const createdPost = await Post.create({
    postid: id,
    name,
    title,
    contents,
    time,
    password,
  });
  res.json({ post: createdPost });
});

//게시글 상세 조회
router.get("/posts/:articleId", async (req, res) => {
  const postId = req.params.articleId;
  const posts = await Post.find(
    { postid: postId },
    { _id: 0, title: 1, name: 1, time: 1, postid: 1 }
  );
  if (!posts.length) {
    return res.json({
      success: false,
      errorMessage: "게시글이 없습니다.",
    });
  }
  res.json({ posts });
});

//게시글 수정
router.put("/posts/:articleId", async (req, res) => {
  const postId = req.params.articleId;
  const { password, title, contents } = req.body; //사용자가 입력하는 데이터들

  const checkarticleId = await Post.find({ postid: postId });
  const userPws = password;
  const postPws = checkarticleId.map((pass) => pass.password).join() * 1;

  console.log(checkarticleId);
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
  } else if (password === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요",
    });
  }
  if (userPws !== postPws) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치 하지 않습니다!",
    });
  } else {
    await Post.updateOne({ postid: postId }, { $set: { title, contents } });
    return res.status(200).json({
      Message: "수정 완료",
    });
  }
});

//게시글 삭제
router.delete("/posts/:articleId", async (req, res) => {
  const postId = req.params.articleId;
  const { password } = req.body; //사용자가 입력하는 데이터들

  const checkarticleId = await Post.find({ postid: postId });
  const userPws = password;
  const postPws = checkarticleId.map((pass) => pass.password).join() * 1;
  if (password === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요",
    });
  }

  if (userPws !== postPws) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치 하지 않습니다!",
    });
  } else {
    await Post.deleteOne({ postid: postId });
    return res.status(200).json({
      Message: "게시물 삭제 완료",
    });
  }
});

module.exports = router;
