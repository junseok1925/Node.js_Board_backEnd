const express = require("express");
const router = express.Router();
const Posts = require("../schemas/posts");

// ===============================게시글 조회 API===============================
// localhost:3001/api/posts
router.get("/posts", async (req, res) => {
  const posts = await Posts.find(); // Posts 모델의 모든 데이터를 조회해서 posts에 할당
  const getPosts = posts.map((post) => { 
    return {postId: post._id, user: post.user, title: post.title, createdAt: post.createdAt};
          //postId에 post._id의 값을 할당
  });
  res.json({ data: getPosts });
});

// ===============================게시글 상세조회 API===============================
//localhost:3001/api/posts/postId
router.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId; // URL에서 postId를 추출해서 postId에 할당
  // # 400 body 또는 params를 입력받지 못한 경우
  if (!postId) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
  const post = await Posts.findById(postId); // 입력받은 postId를 가진 데이터를 post에 할당
  // # 404 _postId에 해당하는 게시글이 존재하지 않을 경우
  if (!post) {
    return res.status(404).json({
      success: false,
      errorMessage: "게시글 조회에 실패했습니다.",
    });
  }
  // 모두 정상적으로 입력되었을 때 출력
  const getPosts = [post].map((post) => {
    return {postId: post._id, user: post.user, title: post.title, content: post.content, createdAt: post.createdAt,};
  });     
  res.json({ 조회완료: getPosts[0] });
});

// ===============================게시글 수정 API===============================
//localhost:3001/api/posts/postId
router.put("/posts/:postId", async (req, res) => {
  const postId = req.params.postId; // URL에서 postId를 추출해서 postId에 할당
  const { user, password, title, content } = req.body;

  // # 400 body 또는 params를 입력받지 못한 경우
  if (!postId || !user || !password || !title || !content) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
  //
  const post = await Posts.findById(postId);// 입력받은 postId를 가진 데이터를 post에 할당

  // 입력받은 postId의 값을 가진 데이터가 없을 때
  //# 404 _postId에 해당하는 게시글이 존재하지 않을 경우
  if (!post) {
    return res.status(404).json({
      success: false,
      errorMessage: "게시판 조회에 실패하였습니다.",
    });
  }

  // 비밀번호가 일치하는지 확인
  if (post.password !== password) {
    return res.status(401).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }

  // 게시글 업데이트
  const updatePost = await Posts.findByIdAndUpdate(
    postId,
    { user, title, content },
    { new: true } //findByIdAndUpdate메서드가 수정된 데이터를 반환할지 결정한다
                  //기본값으론 수정전 데이터를 반환하지만 new: true를 사용하면 수정된 문서가 반환된다.
  );

  res.json({message: "게시글이 성공적으로 수정되었습니다.", 수정완료: {
                                                            postId: updatePost._id,
                                                            user: updatePost.user,
                                                            title: updatePost.title,
                                                            content: updatePost.content,
                                                            createdAt: updatePost.createdAt,
                                                          },
  });
});

// ===============================게시글 삭제 API===============================
//localhost:3001/api/posts/postId
router.delete("/posts/:postId", async (req, res) => {
  const postId = req.params.postId; // URL에서 postId를 추출해서 postId에 할당
  const password = req.body.password;  // body에 입력한 값을 password에 할당

  // # 400 body 또는 params를 입력받지 못한 경우
  if (!postId || !password) {
    return res.status(400).json({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
  // 입력받은 postId를 가진 데이터를 post에 할당
  const post = await Posts.findById(postId);

  // 입력받은 postId의 값을 가진 데이터가 없을 때
  //# 404 _postId에 해당하는 게시글이 존재하지 않을 경우
  if (!post) {
    return res.status(404).json({
      success: false,
      errorMessage: "게시판 조회에 실패하였습니다.",
    });
  }

  // 비밀번호가 일치하는지 확인
  if (post.password !== password) {
    return res.status(401).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  }

  // 게시글 삭제
  await Posts.deleteOne({_id: postId});

  res.json({message: "게시글이 삭제되었습니다.",});
});

// ===============================게시글 등록 API===============================
//localhost:3001/api/posts
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;
  if (!user || !password || !title || !content) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다",
    });
  }
  const createdPost = await Posts.create({ user, password, title, content, createdAt: new Date()});
  res.json({ message: "게시글을 생성하였습니다.", 등록완료: createdPost});
});

module.exports = router;
