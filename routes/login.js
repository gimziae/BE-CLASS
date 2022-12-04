// @ts-check
const express = require('express');
const { userCheck } = require('../controllers/userController');
const db = require('../controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

// 로그인 처리
router.post('/', async (req, res) => {
  const loginUser = await db.userCheck(req.body.id);
  // 중복된 회원이 있다면!
  if (loginUser) {
    if (loginUser.password === req.body.password) {
      // 세션에 저장
      req.session.login = true;
      req.session.userId = req.body.id;

      // 쿠키발행
      res.cookie('user', req.body.id, {
        maxAge: 1000 * 10,
        httpOnly: true,
        signed: true,
      });

      res.redirect('/dbBoard');
    } else {
      res.status(400);
      res.send(
        '비밀번호가 일치하지 않습니다<br><a href="/login">로그인 다시하기</a>',
      );
    }
  } else {
    res.status(400);
    res.send(
      '일치하는 아이디가 없습니다.<br><a href="/login">로그인 다시하기</a>',
    );
  }
});

// 로그아웃 처리
router.get('/logout', (req, res) => {
  // 세션처리한 걸 모두 삭제시킨다
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie('user'); // 쿠키 클리어
    res.redirect('/');
  });
});

module.exports = router;
