// @ts-check

const express = require('express');

const router = express.Router();

// DB
const USER = [
  {
    id: 'gimziae',
    name: '김지애',
    email: 'ziae@gmail.com',
  },
  {
    id: 'songgang',
    name: '송강',
    email: 'gang@gmail.com',
  },
];

// EJS 사용 파트 localhost:4000/users/
router.get('/', (req, res) => {
  res.render('users', { USER, userCounts: USER.length });
});

// 전체 회원 목록 조회
router.get('/list', (req, res) => {
  res.send(USER);
});

// GET 회원 정보 조회
router.get('/id/:id', (req, res) => {
  const findUser = USER.find((user) => user.id === req.params.id);

  if (findUser) {
    res.send(findUser);
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404; // 상태값
    throw err;
  }
});

// POST 새로운 회원 등록
router.post('/', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    if (req.query.id && req.query.name && req.query.email) {
      const newUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER.push(newUser);
      res.send('회원등록 완료');
    } else {
      const err = new Error('Unexpected Query!');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.body) {
    if (req.body.id && req.body.name && req.body.email) {
      const newUser = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
      };
      USER.push(newUser);
      res.redirect('/users'); // 회원가입 처리가 되면 새로 고침하게 설정!
    } else {
      const err = new Error('Unexpected Query!');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('no data!!');
    err.statusCode = 404;
    throw err;
  }
});

// PUT 회원 정보 수정
router.put('/:id', (req, res) => {
  if (req.query.id && req.query.name && req.query.email) {
    const findUserIndex = USER.findIndex((user) => user.id === req.params.id);
    if (findUserIndex !== -1) {
      const modifyUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };

      USER[findUserIndex] = modifyUser;
      res.send('회원 정보 수정 완료');
    } else {
      const err = new Error('Unexpected Query!');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404;
    throw err;
  }
});

// DELETE 회원 정보 삭제
router.delete('/:id', (req, res) => {
  const findUserIndex = USER.findIndex((user) => user.id === req.params.id);
  if (findUserIndex !== -1) {
    USER.splice(findUserIndex, 1);
    res.send('회원 정보 삭제 완료');
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
