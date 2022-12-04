// @ts-check
const express = require('express');
const db = require('../controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

// 로그인 처리
router.post('/', (req, res) => {
  db.userCheck(req.body.id, (data) => {
    // 같은 걸 찾았다면! (세션에 저장된 아이디가 있다면)
    if (data.length > 0) {
      // 찾은 데이터의 비밀번호값과 입력한 패스워드 값이 같다면
      if (data[0].PASSWORD === req.body.password) {
        // 새로운 새션값을 만들어!
        req.session.login = true;
        // 뽑아쓸 수 있도록 처리해둠
        req.session.userId = req.body.id;
        // 로그인이 완료되면 게시판 페이지로 이동

        // 쿠키발행
        res.cookie('user', req.body.id, {
          maxAge: 1000 * 10,
          httpOnly: true,
          signed: true, // 쿠키를 암호화해서 저장시키는 옵션
        });

        res.redirect('/dbBoard');
      } else {
        res.status(400); // 잘못된 요청
        res.send(
          '비밀번호가 일치하지 않습니다<br><a href="/login">로그인 다시하기</a>',
        );
      }
    } else {
      res.status(400); // 잘못된 요청
      res.send(
        '일치하는 아이디가 없습니다.<br><a href="/login">로그인 다시하기</a>',
      );
    }
  });
});

// 로그아웃 처리
router.get('/logout', (req, res) => {
  // 세션처리한 걸 모두 삭제시킨다
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie('user');
    res.redirect('/');
  });
});

module.exports = router;
