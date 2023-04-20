const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comments.js");
const Posts = require("../schemas/posts.js");

// ===============================댓글 등록 API===============================
//localhost:3001/posts/postId/comments
router.post("/posts/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  const { user, password, content } = req.body;
  if (!postId || !user || !password || !content) {
    return res.status(400).json({
      success: false,
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
  const post = await Posts.findById(postId);
  if (!post) {
    return res.status(404).json({
      success: false,
      message: "게시글 조회에 실패하였습니다.",
    });
  }
  // if (!post.comments) {
  //   post.comments = [];
  // }
  const createdComments = await Comments.create({
    user: user,
    password: password,
    content: content,
    createdAt: new Date(),
    postId: postId, // 해당 게시물에 대한 댓글임을 알려주기위해 추가
  });
  res
    .status(200)
    .json({ message: "댓글을 생성하였습니다.", 댓글생성완료: createdComments });
});
// ===============================댓글 목록 조회 API===============================
//localhost:3000/posts/postId/comments
router.get("/posts/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  const post = await Posts.findById(postId);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "게시글 조회에 실패하였습니다.",
    });
  }
  const comments = await Comments.find({ postId: postId });
  if (!comments) {
    return res.status(404).json({
      success: false,
      message: "댓글이 존재하지 않습니다.",
    });
  }
  const getComment = comments.map((comment) => ({
    commentId: comment._id,
    user: comment.user,
    content: comment.content,
    createdAt: comment.createdAt,
  }));
  return res.status(200).json({ 댓글목록: getComment });
});

// ===============================댓글 수정 API===============================
//localhost:3001/posts/postId/comments/commentId
router.put("/posts/:postId/comments/:commentId", async (req, res) => {
  const commentId = req.params.commentId;
  const { password, content } = req.body;

  if (!password || !content) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }

  const comment = await Comments.findById(commentId);
  if (!comment) {

    return res.status(404).json({
      success: false,
      errorMessage: "댓글 조회에 실패하였습니다.",
    });
  }
  if (comment.password !== password) {
    return res.status(401).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }
  const updateComments = await Comments.findByIdAndUpdate(
    commentId,
    { user: comment.user, content: content, password: comment.password },
    { new: true }
  );

  res.json({
    message: "댓글이 수정되었습니다.",
    수정완료: {
      commentId: updateComments._id,
      user: updateComments.user,
      content: updateComments.content,
      createdAt: updateComments.createdAt,
    },
  });
});
// ===============================댓글 삭제 API===============================
//localhost:3001/posts/postId/comments/commentId
router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { password } = req.body;
  
    if (!password) {
      return res.status(400).json({
        message: "데이터 형식이 올바르지 않습니다.",
      });
    }
  
    const comment = await Comments.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        errorMessage: "댓글 조회에 실패하였습니다.",
      });
    }
    if (comment.password !== password) {
      return res.status(401).json({
        success: false,
        errorMessage: "비밀번호가 일치하지 않습니다.",
      });
    }
  
    await Comments.deleteOne({ _id: commentId, postId: postId });
  
    res.json({
      message: "댓글이 삭제되었습니다.",
    });
  });

module.exports = router;
