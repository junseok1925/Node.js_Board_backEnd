const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../schemas/user");


//================================ 로그인 API //================================
// 로그인이면 get을 쓰는게 맞지 않는가? 
// -> 모든 get메서드로 보내는 api는 전부 다 주소에 해당하는 데이터가 노출이 되게 되는 문제가 발생할 수 있다
// 그래서 보안적으로도 post가 더 좋다
// 그리고 인증정보를 생성해서 받아온다는 내용이기 떄문에 post가 더 적합하다.
router.post('/auth', async (req,res) => {
    const {nickname, password } = req.body;

    // 이메일이 일치하는 user를 찾는다.
    const user = await User.findOne({ nickname });

    // #412 해당하는 유저가 존재하지 않는 경우
    if(!user || user.password !== password){
        res.status(400).json({
            errMessage: "닉네임 또는 패스워드를 확인해주세요."
        });
        return;
    }
    // JWT 생성하기
    // userId에 DB의 userId를 할당, 비밀키는 "customized-secret-key" 이다.
    const token = jwt.sign({userId : user.userId}, "customized-secret-key");

    // token값을 Bearer형태로 "Authorization"이라는 이름으로 전달
    res.cookie("Authorization", `Bearer ${token}`);
    res.status(200).json({token});
});

module.exports = router;