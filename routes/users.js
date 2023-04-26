const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js');

const User = require('../schemas/user.js');

// ===================================== 내 정보 조회 API =====================================
router.get('/users/me', authMiddleware, async (req, res) => {
  const { nickname, password } = res.locals.user;
  res.status(200).json({
    users: {
      nickname: nickname,
      password: password,
    },
  });
});

// ===================================== 회원가입 API =====================================
router.post('/users', async (req, res) => {
  try {
    const { nickname, password, confirmPassword } = req.body;
    // # 412 닉네임 형식이 비정상인 경우
    if (!/^[a-zA-Z0-9]+$/.test(nickname) || nickname.length < 3) {
      return res.status(412).json({
        errorMessage: '닉네임의 형식이 일치하지 않습니다.',
      });
    }

    // # 412 password 형식이 비정상인 경우
    if (password.length < 4) {
      return res.status(412).json({
        errorMessage: '패스워드 형식이 일치하지 않습니다.',
      });
    }

    // # 412 password에 nickname이 포함되어있는 경우
    if (password.includes(nickname)) {
      return res.status(412).json({
        errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
      });
    }

    // # 412 password와 confirmPassword가 일치하지않는 경우
    if (password !== confirmPassword) {
      return res.status(412).json({
        errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
      });
    }

    // #412 nickname이 중복된 경우
    const existsUsers = await User.findOne({nickname});
    if (existsUsers) {
      return res.status(412).json({
        errorMessage: '중복된 닉네임입니다.',
      });
    }

    const user = new User({ nickname, password });
    await user.save();

    res.status(201).json({ message: '회원가입에 성공했습니다.' });

    // #400 예외 케이스에서 처리하지 못한 에러
  } catch (error) {
    console.error(error);
    res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

module.exports = router;
