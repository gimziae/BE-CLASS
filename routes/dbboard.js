// @ts-check
const express = require('express');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const fs = require('fs'); // node 기본 모듈
const db = require('../controllers/boardController');
const req = require('express/lib/request');

const router = express.Router();

// multer setting
const dir = './uploads'; // 폴더 설정
const storage = multer.diskStorage({
  // 폴더가 어디로 갈건지
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  // 파일이름은 어떻게 할건지
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now());
  },
});
const limits = {
  // 1024 * 1024 = 1mb 용량 설정
  fileSize: 1024 * 1024 * 2,
};
const upload = multer({ storage, limits });
// 특정 폴더가 존재하는지 확인
// 폴더가 있으면 넘어가고 없다면 dir 만들어라
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

// 로그인 여부 확인하는 함수
function isLogin(req, res, next) {
  console.log('session', req.session.login, 'cookie', req.signedCookies.user);
  // 로그인이 되어 있다면! = true or 쿠키가 있던지
  if (req.session.login || req.signedCookies.user) {
    next();
  } else {
    // 로그인이 안되어있을 경우
    res.status(400);
    res.send(
      '로그인이 필요한 서비스 입니다.<br><a href="/login/">로그인 페이지로 이동</a>',
    );
  }
}

// dbBoard 메인페이지(get)
router.get('/', isLogin, async (req, res) => {
  const ARTICLE = await db.getAllArticles();
  const articleCounts = ARTICLE.length;
  res.render('dbBoard', {
    ARTICLE,
    articleCounts,
    userId: req.session.userId,
  });
});

// 모든 게시글 데이터를 받아오는 라우터(get)
router.get('/getAll', (req, res) => {
  db.getAllArticles((data) => {
    res.send(data);
  });
});

// 수정 라우터(get)
router.get('/write', isLogin, (req, res) => {
  res.render('dbBoard_write');
});

// 게시글 추가하는 라우터(post)
router.post('/write', isLogin, upload.single('img'), async (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      USER_ID: req.session.userId,
      TITLE: req.body.title,
      CONTENT: req.body.content,
      IMAGE: req.file ? req.file.filename : null, // req.file이 들어오면 filename을 저장해주고 없을경우 null 값 저장
    };

    const writeResult = await db.writeArticle(newArticle);
    if (writeResult) {
      res.redirect('/dbBoard');
    } else {
      const err = new Error('db에 글 추가 실패');
      throw err;
    }
  } else {
    const err = new Error('글 제목 또는 내용이 없습니다');
    throw err;
  }
});

// 게시글을 수정페이지로 이동하는 라우터(delete)
router.get('/modify/:id', isLogin, async (req, res) => {
  // 컨트롤러에서 받아온 게시글데이터
  const findArticle = await db.getArticle(req.params.id);
  console.log(findArticle);
  // 값을 받아 왔다면!
  if (findArticle)
    res.render('dbBoard_modify', { selectedArticle: findArticle });
});

// 게시글 수정하는 라우터
// 사진 업로드 할 경우에는 "upload.single('img')" 꼭 인자로 넣어줘야 된다!! => ejs 에서로 부터 가져올 인자! name='img' 인 것을 가져온다
router.post('/modify/:id', isLogin, upload.single('img'), async (req, res) => {
  try {
    // req.file이 항상 들어오는 것이 아니므로 포함해서 처리해주면 안됨
    // if (req.body.title && req.body.content && req.file) {  =>XXX
    if (req.body.title && req.body.content) {
      // 두개의 인자를 받아야한다 modifyArticle  req.file
      const updateResult = await db.modifyArticle(
        req.params.id,
        req.body,
        req.file,
      );
      if (updateResult) {
        res.redirect('/dbBoard');
      } else {
        const err = new Error('수정 실패');
        throw err;
      }
    } else {
      const err = new Error('수정할 내용이 없습니다.');
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.send(`${err}<br><a href="/">메인페이지로 이동</a>`);
  }
});

// 게시글 삭제하는 라우터
router.delete('/delete/:id', isLogin, async (req, res) => {
  if (req.params.id) {
    const deleteResult = await db.deleteArticle(req.params.id);
    if (deleteResult) res.send('삭제완료');
    else {
      const err = new Error('글 삭제 실패');
      err.statusCode = 400;
      throw err;
    }
  } else {
    const err = new Error('ID 파라미터 값이 없습니다.');
    err.statusCode = 400;
    throw err;
  }
});

module.exports = router;
