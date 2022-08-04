const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth-middlware");
const { Post } = require("../models");
const { like } = require("../models");
const { Op } = require("sequelize");
//좋아요 게시물 확인 API ok
router.get("/post/like", authorization, async (req, res) => {
  const { userId } = res.locals.user;
  const likedposts = await like.findAll({
    where: { userId: userId },
  });
  console.log(likedposts.length);
  if (!likedposts.length) {
    return res.status(400).json({
      errorMessage: "좋아요한 게시물이 없습니다.",
    });
  }
  
  //like 데이터 베이스에서 로그인 유저 아이디가 좋아요한 postid를 출력
  const likedpostId = likedposts.map((table) => table.postId);
  console.log(likedpostId); 

  //post데이터 베이스 출력에서 postid 를 like 와 외부키로 연동시켜서 붙여넣기
  Post.hasMany(like, { foreignKey: "postId" });
  like.belongsTo(Post, { foreignKey: "postId" });
  const Posts = await Post.findAll({
    where: { postid: likedpostId },
    include: [
      {
        model: like,
      },
    ],
  });

  let likedPosts = Posts.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        contents: post.contents,
        likes: post.likes.length,
      };
    })
  
  //좋아요 높은순으로 정렬
  res.json(likedPosts.sort(function(a, b) {
      return b.likes- a.likes;
    }))
});

//좋아요 기능 API ok
router.put("/posts/:postId/like", authorization, async (req, res) => {
  const postId = req.params.postId;
  const { userId } = res.locals.user;
  const checkedPost = await Post.findByPk(postId);
  if (!checkedPost) {
    return res.status(400).json({
      errorMessage: "존재하지 않는 게시물입니다.",
    });
  }
  const checkliked = await like.findAll({
    where: { [Op.and]: [{ postId: postId }, { userId: userId }] },
  });

  if (!checkliked.length) {
    const liker = new like({ userId, postId });
    await liker.save();
    return res.json({ Message: "좋아요" });
  }
  if (checkliked.length) {
    like.destroy({ where: { postId: postId, userId: userId } });
    return res.json({ Message: "좋아요 취소" });
  }
  res.json({ checkliked });
});

module.exports = router;
