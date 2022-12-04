// @ts-check
const express = require('express');

const router = express.Router();

const ARTICLE = [
  {
    title: 'title1',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi vero perspiciatis dolore odio harum, temporibus dolorum mollitia animi quas recusandae nesciunt eveniet hic quaerat nulla fuga officiis deserunt saepe nemo.',
  },
  {
    title: 'title2',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, doloribus. Dolore corporis, architecto, quo nihil natus ad iure fugit necessitatibus, atque ab a cum minus assumenda alias dolores perspiciatis voluptatum.',
  },
];
// 목록 보여주기 render = 화면 보여줘!!!
router.get('/', (req, res) => {
  const articleLen = ARTICLE.length;
  res.render('board', { ARTICLE, articleCounts: articleLen });
});

// 글 쓰기모드 페이지로 이동
router.get('/write', (req, res) => {
  res.render('board_write');
});

// 글 추가 기능 수행
router.post('/write', (req, res) => {
  if (req.body) {
    if (req.body.title && req.body.content) {
      const newBoard = {
        title: req.body.title,
        content: req.body.content,
      };
      ARTICLE.push(newBoard);
      res.redirect('/board');
    } else {
      const err = new Error('내용이 없습!');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('No Data!');
    err.statusCode = 404;
    throw err;
  }
});

// 글 수정 모드 페이지로 이동
router.get('/modify/:title', (req, res) => {
  const arrIndex = ARTICLE.findIndex(
    (_article) => _article.title === req.params.title
  );
  const selectedArticle = ARTICLE[arrIndex];
  res.render('board_modify', { selectedArticle });
});

// 글 수정 기능 수행
router.post('/modify/:title', (req, res) => {
  if (req.body.title && req.body.content) {
    const arrIndex = ARTICLE.findIndex(
      (_article) => _article.title === req.params.title
    );
    ARTICLE[arrIndex].title = req.body.title;
    ARTICLE[arrIndex].content = req.body.content;
    res.redirect('/board');
  } else {
    const err = new Error('요청 데이터 이상');
    err.statusCode = 400;
    throw err;
  }
});

// 글 삭제 기능
router.delete('/delete/:title', (req, res) => {
  const arrIndex = ARTICLE.findIndex(
    (_article) => _article.title === req.params.title
  );
  if (arrIndex !== -1) {
    ARTICLE.splice(arrIndex, 1);
    // res.send('삭제 완료');
    res.redirect('/board'); // redirect를 쓰면 편리하긴 하나, 프론트단에 안보일 수도 있으므로! 지양하자
  } else {
    const err = new Error('해당 제목을 가진 글이 없습니다');
    err.statusCode = 400;
    throw err;
  }
});

module.exports = router;
