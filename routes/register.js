// @ts-check
const express = require('express');
const { register } = require('ts-node');
const db = require('../controllers/userController');

const router = express.Router();

// 회원가입 페이지 mongoDB 버전
router.get('/', (req, res) => {
  res.render('register');
});

// 회원가입 처리
router.post('/', async (req, res) => {
  const duplicatedUser = await db.userCheck(req.body.id);
  // 중복되는 회원이 없을 때!
  if (!duplicatedUser) {
    const registerResult = await db.registerUser(req.body);
    console.log(registerResult);
    if (registerResult) {
      res.send('회원가입 성공!<br><a href="/login">로그인 페이지로 이동</a>');
    } else {
      res.status(500);
      res.send(
        '회원가입 문제 발생<br><a href="/register">회원가입 페이지로 이동</a>',
      );
    }
  } else {
    res.status(400);
    res.send(
      '중복된 회원 아이디가 존재 합니다.<br><a href="/register">회원가입 페이지로 이동</a>',
    );
  }
});

module.exports = router;
