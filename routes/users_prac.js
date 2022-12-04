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

// localhost:4000/users/
router.get('/', (req, res) => {
  res.render('users', { USER, userCounts: USER.length });
});

// 유저라우터, 전체 회원 목록 조회
router.get('/list', (req, res) => {
  res.send(USER);
});

// 특정 id를 가진 회원 정보 조회(get)
router.get('/id/:id', (req, res) => {
  // 주소의 아이디값을 가진 것을 찾겠다!
  // USER배열의 id값과 요청한 파람스의 id값이 같으면 리턴! (중괄호와 return은 생략가능 ; 한줄로 끝낼 경우에만 가능)
  const findUser = USER.find((user) => user.id === req.params.id);

  // findUser 값이 있다면
  if (findUser) {
    //   findeUser값을 보내라
    res.send(findUser);
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404; // 상태값
    throw err;
    //   없다면 아래 멘트 보내라 : 설정해주지 않으면 undefinded 뜸
    // res.send('일치하는 ID를 찾지 못했습니다.');
  }
});

// 새로운 회원 등록(배열값 추가)(post)
router.post('/', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    // id와 name 값이 쿼리로 들어온다면, localhost:4000/users?id=a&name=b
    if (req.query.id && req.query.name && req.query.email) {
      //  새로운 배열 생성
      const newUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      // USER 배열에 newUser(생성한 새로운 회원정보) Push!
      USER.push(newUser);
      res.send('회원등록 완료');
    } else {
      const err = new Error('Unexpected Query!');
      err.statusCode = 404; // 상태값
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
      res.send('회원등록 완료');
    } else {
      const err = new Error('Unexpected Query!');
      err.statusCode = 404; // 상태값
      throw err;
    }
  } else {
    // 쿼리도 바디도 없는 상황!
    const err = new Error('no data');
    err.statusCode = 404;
    throw err;
  }
});

// 회원 정보 수정(put) Localhost:4000/users/tetz?id=test&name=test
router.put('/:id', (req, res) => {
  // id와 name 값이 들어오면
  if (req.query.id && req.query.name && req.query.email) {
    // 인덱스값 정의
    const findUserIndex = USER.findIndex((user) => user.id === req.params.id);
    // 인덱스에서 -1은 값이 없다는 것
    // 즉 값이 있다면 을 조건으로 걸어준다!
    if (findUserIndex !== -1) {
      // 새로운 수정값 생성
      const modifyUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };

      // 찾은 인덱스번째 배열에 수정값 넣는다!
      USER[findUserIndex] = modifyUser;
      res.send('회원 정보 수정 완료');
    } else {
      const err = new Error('Unexpected Query!');
      err.statusCode = 404; //상태값
      throw err;
    }
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404; // 상태값
    throw err;
  }
});

// 회원 정보 삭제(delete) Localhost:4000/users/tetz
router.delete('/:id', (req, res) => {
  // 인덱스값 정의
  const findUserIndex = USER.findIndex((user) => user.id === req.params.id);
  if (findUserIndex !== -1) {
    // splice(i, n) > i번째 값부터 n개를 삭제
    USER.splice(findUserIndex, 1);
    res.send('회원 정보 삭제 완료');
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404; // 상태값
    throw err;
  }
});

// 동적 웹 그리기
/*
router.get('/show', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' }); // 외우기!
  res.write('<h1>Hello, Dynamic Web Page!</h1>');
  for (let i = 0; i < USER.length; i++) {
    res.write(`<h2>USER ID is ${USER[i].id}</h2>`);
    res.write(`<h2>USER NAME is ${USER[i].name}</h2>`);
    res.write(`<h2>USER EMAIL is ${USER[i].email}</h2>`);
  }
  res.end('');
});
*/

module.exports = router;
