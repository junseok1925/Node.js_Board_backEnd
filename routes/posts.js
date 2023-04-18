const express = require("express"); // express라이브러리를 express 변수에 할당
const router = express.Router(); // 다시 express.Router()라는 함수를 실행시켜 router이라는 변수에 할당
const Posts = require("../schemas/posts"); // post메서드를 이용해서 body데이터를 불러와 등록

const posts = [
  [
    {
      postId: "62d6d12cd88cadd496a9e54e",
      user: "Developer",
      title: "안녕하세요",
      createdAt: "2022-07-19T15:43:40.266Z",
    },
    {
      postId: "62d6cc66e28b7aff02e82954",
      user: "Developer",
      title: "안녕하세요",
      createdAt: "2022-07-19T15:23:18.433Z",
    },
  ],
];

  //=================================== GET으로 게시글 전체 목록 조회 ================================
  
  router.get("/posts", async (req, res) => {
    try {
      const posts = await Posts.find().sort("-createdAt"); // 작성일 기준 내림차순 정렬
      res.status(200).json(posts); // 응답으로 전체 게시물 목록을 보냄
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "서버 에러" });
    }
  });

//=================================== post로 데이터 전송 ================================

// 게시글 등록 API
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;

  //=================================== 특정 조건을 맞지않게 게시물 작성시 false ================================

  // 만약 게시글을 작성할때 user,password,title,content의 값을 입력하지않으면 작성이 안됨
  if (
    !req.body.user ||
    !req.body.password ||
    !req.body.title ||
    !req.body.content
  ) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다",
    });
  }
  //================================== create함수를 이용 압력받은 게시물을 등록 ================================
  const { ObjectId } = require("mongodb"); //게시글마다 고유한 postId를 부여
  const createdAt = new Date();
  const createdPosts = await Posts.create({
    postId: new ObjectId().toString(),
    user,
    password,
    title,
    content,
    createdAt: new Date(), //현재 시간을 저장
  });

  res.json({ posts: createdPosts });
});

module.exports = router; // posts.js파일 안에 있는 변수router를 app.js에 보내줘야할때 선언 방식
