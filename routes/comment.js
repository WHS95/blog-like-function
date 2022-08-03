const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/auth-middlware");
const { Comments } = require("../models");


//댓글 목록 조회 API ok
router.get("/comments/:postId", async (req, res) => {
  ///comments/:articleId위 url에서 articleId부분에 들어간 값을 PostId로 선언하겠다.
  const { postId } = req.params;
  //db 컬렉션인 Comment에 들어있는 데이터중에 Url에서 가져온 값과 데이터에 postid의 키값이 같을 경우에
  //찾아서Comments에 반영을 할 것이며 그 후
  const Comment = await Comments.findAll({ where: { postId } });
  //배열로 넘어오기에 만약 들어온 Conmments에 데이터가 없다면 0(false)을 출력할것이다.
  //그렇기에 !을 이용하여 없는 경우에 응답값을 만들어준다.
  if (!Comment.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글이 없습니다.",
    });
  }
  //JS shorthand property(객체 초기자)
  res.json({
    Comment,
  });
});

//댓글 작성 ok
router.post("/comments/:postId", authorization, async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  if (comment === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글내용을 입력해주세요",
    });
  }
  const { userId } = res.locals.user;
  const { nickname } = res.locals.user;
  const createdComment = new Comments({ userId, nickname, postId, comment });
  await createdComment.save();
  res.json({ Message: "작성 완료" });
});

//댓글 수정 ok
router.put("/comments/:commentId", authorization, async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const { userId } = res.locals.user;
  const checkedComment = await Comments.findByPk(commentId);
  const CommentUserId = checkedComment.dataValues.userId;
  if (userId != CommentUserId) {
    return res.status(400).json({
      success: false,
      errorMessage: "수정할수 없습니다.",
    });
  } else if (comment === undefined) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글내용을 입력해주세요",
    });
  }
  checkedComment.update({ comment: comment });
  res.json({ Message: "수정 완료" });
});

//댓글 삭제 ok
router.delete("/comments/:commentId", authorization, async (req, res) => {
  const { commentId } = req.params;
  const { userId } = res.locals.user;
  const checkedComment = await Comments.findOne({
    where: { commentId: commentId },
  });
  const CommentUserId = checkedComment.dataValues.userId;
  console.log(checkedComment);
  if (userId != CommentUserId) {
    return res.status(400).json({
      success: false,
      errorMessage: "삭제할 수 없습니다.",
    });
  }
  Comments.destroy({ where: { commentId: commentId } });
  res.json({ Message: "댓글 삭제 완료" });
});

//위에서 사용되어진 라우터들의 기능을 모아서 module로써 내보내겠다.
module.exports = router;
