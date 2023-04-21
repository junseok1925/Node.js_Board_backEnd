const mongoose = require('mongoose');

//mongoDB와 연결
const connect = () => {
  mongoose
    .connect('mongodb://localhost:27017/boardBackend')
    //mongoDB연결에 오류가 발생하면 발생된 오류를 출력
    .catch((err) => console.log(err));
};
//mongoose에 연결했을 때 에러 발생시 에러 내용 출력
mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

//connect 익명함수를 밖에서 쓸수있게 내보냄
module.exports = connect;
