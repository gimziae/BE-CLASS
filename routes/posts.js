// @ts-check

const express = require('express');

const router = express.Router();

// DB
const POST = [
  {
    title: '제목입니다1',
    content: '남기실 말을 적어주세요1.',
  },
  {
    title: '제목입니다2',
    content: '남기실 말을 적어주세요2.',
  },
];

router.get('/', (req, res) => {
  res.render('posts', { POST, postCounts: POST.length });
});

router.get('/list', (req, res) => {
  res.send(POST);
});

// GET
router.get('/title/:title', (req, res) => {
  const findPost = POST.find((post) => post.title === req.params.title);

  if (findPost) {
    res.send(findPost);
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404; // 상태값
    throw err;
  }
});

// POST 새로운 글 등록
router.post('/', (req, res) => {
  if (req.body) {
    if (req.body.title && req.body.content) {
      const newPost = {
        title: req.body.title,
        content: req.body.content,
      };
      POST.push(newPost);
      res.redirect('/posts');
    } else {
      const err = new Error('Missing data!');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('No Data!');
    err.statusCode = 404;
    throw err;
  }
});

// DELETE 회원 정보 삭제
router.delete('/:title', (req, res) => {
  const findPostIndex = POST.findIndex(
    (post) => post.title === req.params.title
  );
  if (findPostIndex !== -1) {
    POST.splice(findPostIndex, 1);
    res.send('회원 정보 삭제 완료');
  } else {
    const err = new Error('Unexpected Query!');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
