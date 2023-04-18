const express = require("express"); // express라이브러리를 express 변수에 할당
const router = express.Router(); // 다시 express.Router()라는 함수를 실행시켜 router이라는 변수에 할당

const posts = [
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
];

//=================================== 계시글 조회 ================================
//localhost:3001/api/posts(get)
router.get("/posts", async (req, res) => { 
    res.status(200).json(posts); // 응답으로 전체 게시물 목록을 보냄
  });

//=================================== 게시글 상세 조회 ================================

//localhost:3001/api/posts/postId(get)
// 게시글 상세 조회 API
router.get("/posts/:postId", (req, res) => {
  const { postId } = req.params;
  //filter를 사용
  const [result] = posts.filter((posts) => postId === posts.postId);
  if (!result) {
    return res.status(400).json({
    message: "데이터 형식이 올바르지 않습니다.",
    });
    }
    res.status(200).json({ detail: result });
    });
//=================================== 게시글 수정 ================================


//=================================== 계시글 작성 ================================

// 게시글 등록 API
////localhost:3001/api/posts (post)
const Posts = require("../schemas/posts"); // post메서드를 이용해서 body데이터를 불러와 등록
router.post("/posts", async (req, res) => {
  const { user, password, title, content } = req.body;


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

res.json({ message: "게시글을 생성하였습니다."});

});

module.exports = router; // posts.js파일 안에 있는 변수router를 app.js에 보내줘야할때 선언 방식
