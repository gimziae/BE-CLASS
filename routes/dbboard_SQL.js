// @ts-check
const express = require('express');
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
// 이동 후 isLogin 발동 true 라면 그 다음 콜백함수 실행 아니라면 isLogindml else 문 실행!
router.get('/', isLogin, (req, res) => {
  db.getAllArticles((data) => {
    const ARTICLE = data;
    const articleCounts = ARTICLE.length;
    res.render('dbboard', {
      ARTICLE,
      articleCounts,
      userId: req.session.userId, // 로그인 한 아이디의 유저 정보
    });
  });
  /*
  // 로그인이 된 상태에서만!(req.session.login = true)
  if (req.session.login) {
    db.getAllArticles((data) => {
      const ARTICLE = data;
      const articleCounts = ARTICLE.length;

      res.render('dbboard', {
        ARTICLE,
        articleCounts,
        userId: req.session.userId, // 로그인 한 아이디의 유저 정보
      });
    });
  } else {
    // 로그인이 안되어있을 경우
    res.status(400);
    res.send(
      '로그인이 필요한 서비스 입니다.<br><a href="/login/">로그인 페이지로 이동</a>',
    );
  }
  */
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
router.post('/write', isLogin, (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      userId: req.session.userId,
      title: req.body.title,
      content: req.body.content,
    };

    db.writeArticle(newArticle, (data) => {
      if (data.protocol41) {
        res.redirect('/dbBoard');
      } else {
        const err = new Error('db에 글 추가 실패');
        throw err;
      }
    });
  } else {
    const err = new Error('글 제목 또는 내용이 없습니다');
    throw err;
  }
});

// 게시글을 수정페이지로 이동하는 라우터(delete)
router.get('/modify/:id', isLogin, (req, res) => {
  db.getArticle(req.params.id, (data) => {
    console.log(data);
    if (data.length > 0) {
      res.render('dbBoard_modify', { selectedArticle: data[0] });
    }
  });
});

// 게시글 수정하는 라우터
router.post('/modify/:id', isLogin, (req, res) => {
  if (req.body.title && req.body.content) {
    db.modifyArticle(req.params.id, req.body, (data) => {
      if (data.protocol41) {
        res.redirect('/dbBoard');
      } else {
        const err = new Error('수정 실패');
        throw err;
      }
    });
  } else {
    const err = new Error('수정할 내용이 없습니다.');
    throw err;
  }
});

// 게시글 삭제하는 라우터
router.delete('/delete/:id', isLogin, (req, res) => {
  // db.deleteArticle(req.params, (data) => {
  //   console.log(data);
  //   if (data.protocol41)) {
  //     res.redirect('/dbBoard');
  //   }
  // });

  if (req.params.id) {
    db.deleteArticle(req.params.id, (data) => {
      console.log(data);
      if (data.protocol41) {
        res.send('삭제 완료'); // redirect X
      } else {
        const err = new Error('글 삭제 실패');
        err.statusCode = 400;
        throw err;
      }
    });
  } else {
    const err = new Error('ID 파라미터 값이 없습니다.');
    err.statusCode = 400;
    throw err;
  }
});

module.exports = router;
