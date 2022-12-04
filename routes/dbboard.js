// @ts-check
const express = require('express');
const { ObjectId } = require('mongodb');
const db = require('../controllers/boardController');

const router = express.Router();

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
  res.render('dbboard', {
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
router.post('/write', isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      USER_ID: req.session.userId,
      TITLE: req.body.title,
      CONTENT: req.body.content,
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
  // 값을 받아 왔다면!
  if (findArticle)
    res.render('dbBoard_modify', { selectedArticle: findArticle });
});

// 게시글 수정하는 라우터
router.post('/modify/:id', isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    // 두개의 인자를 받아야한다 modifyArticle
    const updateResult = await db.modifyArticle(req.params.id, req.body);
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
