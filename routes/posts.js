const express = require('express');
const router = express.Router();
const Posts = require('../schemas/posts');
const User = require('../schemas/user');
const authMiddleware = require('../middlewares/auth-middleware');

// ===============================게시글 조회 API===============================
router.get('/posts', authMiddleware, async (req, res) => {
  const posts = await Posts.find();

  const getPosts = posts.map((post) => {
    return {
      postId: post._id,
      userId: post.userId,
      nickname: post.nickname,
      title: post.title,
      createdAt: post.createdAt,
    };
  });
  res.json({ data: getPosts });
});

// ===============================게시글 상세조회 API===============================
router.get('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId; // URL에서 postId를 추출해서 postId에 할당
    const { userId } = res.locals.user;

    // # 400 body 또는 params를 입력받지 못한 경우
    if (!postId) {
      return res.status(400).json({
        message: '데이터 형식이 올바르지 않습니다.',
      });
    }
    const post = await Posts.findById(postId); // 입력받은 postId를 가진 데이터를 post에 할당
    // # 404 _postId에 해당하는 게시글이 존재하지 않을 경우
    if (!post) {
      return res.status(404).json({
        success: false,
        errorMessage: '게시글 조회에 실패했습니다.',
      });
    }
    // 해당 게시물을 작성한 사용자와 로그인된 유저가 일치하는지 확인
    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        errorMessage: '해당 게시물을 조회할 권한이 없습니다.',
      });
    }
    res.json({
      조회완료: {
        postId: post._id,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      errorMessage: '게시글 조회에 실패하였습니다.',
    });
  }
});

// ===============================게시글 수정 API===============================
router.put('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({
        message: '게시글 제목의 형식이 일치하지 않습니다.',
      });
    }

    if (!content) {
      return res.status(400).json({
        message: '게시글 내용의 형식이 일치하지 않습니다.',
      });
    }
    const post = await Posts.findById(postId); // 입력받은 postId를 가진 데이터를 post에 할당
    // # 404 _postId에 해당하는 게시글이 존재하지 않을 경우
    if (!post) {
      return res.status(404).json({
        success: false,
        errorMessage: '존재하지않는 게시물입니다.',
      });
    }
    // 해당 게시물을 작성한 사용자와 로그인된 유저가 일치하는지 확인
    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        errorMessage: '해당 게시물을 삭제할 권한이 없습니다.',
      });
    }
    // 게시글 업데이트
    const updatePost = await Posts.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true } //findByIdAndUpdate메서드가 수정된 데이터를 반환할지 결정한다
      //기본값으론 수정전 데이터를 반환하지만 new: true를 사용하면 수정된 문서가 반환된다.
    );

    res.json({
      message: '게시글이 수정되었습니다.',
      수정완료: {
        title: updatePost.title,
        content: updatePost.content,
        createdAt: updatePost.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      errorMessage: '게시글 수정에 실패하였습니다.',
    });
  }
});

// ===============================게시글 삭제 API===============================
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId; // URL에서 postId를 추출해서 postId에 할당
    const { userId } = res.locals.user;

    // # 400 body 또는 params를 입력받지 못한 경우
    if (!postId) {
      return res.status(400).json({
        message: '데이터 형식이 올바르지 않습니다.',
      });
    }
    const post = await Posts.findById(postId); // 입력받은 postId를 가진 데이터를 post에 할당
    // # 404 _postId에 해당하는 게시글이 존재하지 않을 경우
    if (!post) {
      return res.status(404).json({
        success: false,
        errorMessage: '게시글 조회에 실패했습니다.',
      });
    }
    // 해당 게시물을 작성한 사용자와 로그인된 유저가 일치하는지 확인
    if (post.userId !== userId) {
      return res.status(403).json({
        success: false,
        errorMessage: '해당 게시물을 삭제할 권한이 없습니다.',
      });
    }
    // 게시글 삭제
    await Posts.deleteOne({ _id: postId });

    res.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      errorMessage: '게시글 삭제에 실패하였습니다.',
    });
  }
});

// ===============================게시글 등록 API===============================
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId, nickname } = res.locals.user;
    if (!userId) {
      return res.status(400).json({
        success: false,
        errorMessage: '로그인 후 해당 기능을 사용할 수 있습니다.',
      });
    }
    if (!title || !content) {
      return res.status(412).json({
        success: false,
        errorMessage: '데이터 형식이 올바르지 않습니다.',
      });
    }
    if (typeof title !== 'string') {
      return res.status(412).json({
        success: false,
        errorMessage: '게시글 제목의 형식이 일치하지 않습니다.',
      });
    }
    if (typeof content !== 'string') {
      return res.status(412).json({
        success: false,
        errorMessage: '게시글 내용의 형식이 일치하지 않습니다.',
      });
    }
    const createdPost = await Posts.create({
      title,
      content,
      userId,
      nickname,
      createdAt: new Date(),
    });
    res.json({ message: '게시글을 생성하였습니다.', 등록완료: createdPost });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      errorMessage: '게시글 작성에 실패하였습니다.',
    });
  }
});

module.exports = router;
