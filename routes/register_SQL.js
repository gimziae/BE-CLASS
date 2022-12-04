// @ts-check
const express = require('express');
const db = require('../controllers/userController');

const router = express.Router();

// 회원가입 페이지
router.get('/', (req, res) => {
  res.render('register');
});

// 회원가입 처리
router.post('/', (req, res) => {
  db.userCheck(req.body.id, (data) => {
    // 데이터의 길이가 0이면 = 중복된 회원이 없다면!
    if (data.length === 0) {
      db.registerUser(req.body, (result) => {
        // protocol41 = 데이터를 정상적으로 받아 왔다면!
        if (result.protocol41) {
          res.send(
            '회원가입 성공!<br><a href="/login">로그인 페이지로 이동</a>',
          );
        } else {
          // 데이터가 잘못 받아져왔다면
          res.status(400);
          res.send(
            '회원가입 문제 발생<br><a href="/register">회원가입 페이지로 이동</a>',
          );
        }
      });
      // 중복된 회원이 있따면
    } else {
      res.status(400);
      res.send(
        '중복된 회원 아이디가 존재 합니다.<br><a href="/register">회원가입 페이지로 이동</a>',
      );
    }
  });
});

module.exports = router;
