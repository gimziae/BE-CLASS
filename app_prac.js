// @ts-check

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;
// ejs
app.set('view engine', 'ejs');

// 라우터 불러오기(import)
const homeRouter = require('./routes'); // = ./routes/index
const userRouter = require('./routes/users');

/* static > 접근 가능 범위를 정하기 위한 선언!!
: css , img 등 다른요소에 접근하기 경로 지정
= app.use('/css', express.static('public/css')); */
app.use(express.static('public'));
app.use(bodyParser.json()); // json형태로 주고받겠다!
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('여기로 가면', 이 라우터를 작동시킨다)
app.use('/', homeRouter); // 홈 화면
app.use('/users', userRouter); // users 화면

// app에서 바로 index 할당하기
// app.get('/', (req, res) => {
//   res.render('index');
// });

// err 컨트로러
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.send(err.message);
});

app.listen(PORT, () => {
  console.log(`서버는 ${PORT}번에서 실행 중 입니다.`);
});
