const express = require("express"); // express라이브러리를 express 변수에 할당
const router = express.Router(); // 다시 express.Router()라는 함수를 실행시켜 router이라는 변수에 할당

const posts = [
{  
    postId: "62d6d12cd88cadd496a9e54e",      
    user: "Developer",
    password: "1234",      
    title: "안녕하세요",   
    content : "안녕하세요 content입니다11",
    createdAt: "2022-07-19T15:43:40.266Z"   
         
},
{      
    postId: "62d6cc66e28b7aff02e82954",      
    user: "Developer",
    password: "4321",    
    title: "안녕하세요",  
    content : "안녕하세요 content입니다22",    
    createdAt: "2022-07-19T15:23:18.433Z"   
     }   
];

// 게시글 등록 API
// post메서드를 이용해서 body데이터를 불러와 등록
const Posts = require("../schemas/posts.js");
router.post("/posts", async (req, res) => {
    const { user, password, title, content } = req.body;

  //goodsId는 고유한 값이여하기때문에 동일한 goodsId가 있는지 확인
  const posts = await Posts.find({ password }); // await : 동기적으로 처리해라

  // 만약 goods에 길이가 존재하면 이미 값이 있는 것이므로 에러
  if (!req.body.user || !req.body.password || !req.body.title || !req.body.content) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다"
    });
  }

  //게시글을 등록하는 코드
  const { ObjectId } = require("mongodb"); //게시글마다 고유한 postId를 부여
  const createdPosts = await Posts.create({
    postId: ObjectId().toString(),
    user,
    password,
    title,
    content,
    createdAt: new Date()   //현재 시간을 저장
  });
  

  res.json({ posts: createdPosts });
});


module.exports = router; // posts.js파일 안에 있는 변수router를 app.js에 보내줘야할때 선언 방식
