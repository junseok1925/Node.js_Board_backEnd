const express = require("express");
const app = express();
const port = 3001;

const postsRouter = require("./routes/posts.js"); //posts.js에 있는 router를 반환받음
const commentsRouter = require("./routes/comments.js");
const connect = require("./schemas");
connect(); // 가져온 connect 함수 실행


//body-parser Middleware를 쓰기 위한 문법이다, 전역 middleware를 적용하겠다
// 모든 코드에서 body-parse를 등록해서 Request안에 있는 body데이터를 쓰겠다
//post로 들어오는 body데이터를 사용하기 위해서는 이 문법을 통해 사용가능
app.use(express.json());
//전역미들웨어
// 기본적으로 코드는 위에서 아래로 실행되기때문에 app.use()를 거치고 아래 코드 실행됨
app.use("/api", postsRouter); // /api/posts 경로를 처리할 postsRouter 등록
app.use("/api", commentsRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});