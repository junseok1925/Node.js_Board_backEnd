const express = require('express');
const router = express.Router();
const Comments = require('../schemas/comments.js');
const Posts = require('../schemas/posts.js');
const Users = require('../schemas/user.js');
const authMiddleware = require('../middlewares/auth-middleware');

// ===============================댓글 등록 API===============================

router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;
    const { userId, nickname } = res.locals.user;

    if (!userId) {
      return res.status(400).json({
        success: false,
        errorMessage: '로그인 후 해당 기능을 사용할 수 있습니다.',
      });
    }

    if (!comment) {
      return res.status(412).json({
        success: false,
        errorMessage: '내용을 입력해주세요.',
      });
    }

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: '데이터 형식이 올바르지 않습니다.',
      });
    }
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글 존재하지 않습니다.',
      });
    }
    const createdComments = await Comments.create({
      comment,
      nickname,
      userId,
      createdAt: new Date(),
      postId: postId, // 해당 게시물에 대한 댓글임을 알려주기위해 추가
    });
    res
      .status(200)
      .json({ message: '댓글을 작성했습니다.', 댓글생성완료: createdComments });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      errorMessage: '댓글 작성에 실패하였습니다.',
    });
  }
});
// ===============================댓글 목록 조회 API===============================
router.get('/posts/:postId/comments', async (req, res) => {
  const postId = req.params.postId;
  const post = await Posts.findById(postId);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: '게시글이 존재하지않습니다.',
    });
  }
  const comments = await Comments.find({ postId: postId });
  if (!comments) {
    return res.status(404).json({
      success: false,
      message: '댓글 조회에 실패하였습니다.',
    });
  }
  const getComment = comments.map((comment) => ({
    commentId: comment._id,
    userId: comment.userId,
    nickname: comment.nickname,
    comment: comment.comment,
    createdAt: comment.createdAt,
  }));
  return res.status(200).json({ 댓글목록: getComment });
});

// ===============================댓글 수정 API===============================
//localhost:3001/posts/postId/comments/commentId
router.put(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const commentId = req.params.commentId;
      const { comment } = req.body;

      if (!comment) {
        return res.status(412).json({
          message: '데이터 형식이 올바르지 않습니다.',
        });
      }

      const getComment = await Comments.findById(commentId);
      if (!getComment) {
        return res.status(404).json({
          success: false,
          errorMessage: '댓글 존재하지 않습니다.',
        });
      }

      if (getComment.userId !== userId) {
        return res.status(403).json({
          success: false,
          errorMessage: '해당 게시물을 삭제할 권한이 없습니다.',
        });
      }

      const updateComments = await Comments.findByIdAndUpdate(
        commentId,
        { comment },
        { new: true }
      );

      res.json({
        message: '댓글이 수정되었습니다.',
        수정완료: {
          comment: updateComments.comment,
          createdAt: updateComments.createdAt,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        errorMessage: '댓글 수정에 실패하였습니다.',
      });
    }
  }
);
// ===============================댓글 삭제 API===============================
//localhost:3001/posts/postId/comments/commentId
router.delete('/posts/:postId/comments/:commentId',authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { userId } = res.locals.user;

    if (!postId) {
      return res.status(404).json({
        message: '게시글이 존재하지 않습니다',
      });
    }

    const getComment = await Comments.findById(commentId);
    if (!getComment) {
      return res.status(404).json({
        success: false,
        errorMessage: '댓글 조회에 실패하였습니다.',
      });
    }

    if (getComment.userId !== userId) {
      return res.status(403).json({
        success: false,
        errorMessage: '해당 댓글을 삭제할 권한이 없습니다.',
      });
    }

    await Comments.deleteOne({ _id: commentId, postId: postId });

    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      errorMessage: '게시글 삭제에 실패하였습니다.',
    });
  }
});

module.exports = router;
