// @ts-check

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();

const app = express();

// 구조분해 할당
// = const PORT = process.env.PORT;
const { PORT } = process.env;

// 라우터 불러오기(import)
const homeRouter = require('./routes');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const boardRouter = require('./routes/board');
const dataRouter = require('./routes/data');
const dbboardRouter = require('./routes/dbBoard');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

// ejs
app.set('view engine', 'ejs');

// 쿠키파서 이용하기 불러오기
app.use(cookieParser('gimziae'));
app.use(
  session({
    secret: 'nana',
    resave: false, // 변화가 있을 떄만 저장하겠다.
    saveUninitialized: true,
  }),
);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', homeRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/board', boardRouter);
app.use('/data', dataRouter);
app.use('/dbboard', dbboardRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// err controler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.send(err.message);
});

app.listen(PORT, () => {
  console.log(`서버는 ${PORT}번에서 실행 중 입니다.`);
});
