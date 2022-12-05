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
  // 몽구스는 중복체크를 없애도 갠츈
  const registerResult = await db.registerUser(req.body);
  if (registerResult.status === 'success') {
    res.send('회원가입 성공!<br><a href="/login">로그인 페이지로 이동</a>');
  } else if (registerResult.status === 'duplicated') {
    res.status(400); // 사용자의 잘못된 요청
    res.send(
      '중복된 ID 가 존재합니다!!<br><a href="/register">회원가입 페이지로 이동</a>',
    );
  } else {
    res.status(500); // 서버 상의 잘못된 요청
    res.send(
      `${registerResult.err}<br><a href="/register">회원가입 페이지로 이동</a>`,
    );
  }
});

module.exports = router;
