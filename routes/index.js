// @ts-check

// router 폴더에 따로 생성해서 exports 시키기

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  // 쿠키값 데이터 보내주기
  res.render('index', { popup: req.cookies.popup });
});

// /cookie 생성해주는 라우터
router.post('/cookie', (req, res) => {
  res.cookie('popup', 'hide', {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.clearCookie('popup');
  res.send('success!');
});

module.exports = router;
