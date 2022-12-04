// @ts-check

const connection = require('./dbConnect');

const db = {
  getAllArticles: (cb) => {
    connection.query('SELECT * FROM mydb.board;', (err, data) => {
      if (err) throw err;
      console.log(data);
      cb(data);
    });
  },

  // 새로운 글 작성하기
  writeArticle: (newArticle, cb) => {
    connection.query(
      `INSERT INTO mydb.board (USER_ID, TITLE, CONTENT) VALUES ('${newArticle.userId}','${newArticle.title}','${newArticle.content}');`,
      (err, data) => {
        if (err) throw err;
        cb(data);
      },
    );
  },

  // 특정 ID_PK를 가지는 게시글 찾기
  getArticle: (id, cb) => {
    connection.query(
      `SELECT * FROM mydb.board WHERE ID_PK=${id};`,
      (err, data) => {
        if (err) throw err;
        cb(data);
      },
    );
  },

  // 특정 ID_PK를 가지는 게시글 수정하기
  modifyArticle: (id, modifyArticle, cb) => {
    connection.query(
      `UPDATE mydb.board SET TITLE = '${modifyArticle.title}', CONTENT = '${modifyArticle.content}' WHERE ID_PK=${id};`,
      (err, data) => {
        if (err) throw err;
        cb(data);
      },
    );
  },

  // 특정 ID_PK를 가지는 게시글 삭제하기
  deleteArticle: (id, cb) => {
    connection.query(
      `DELETE FROM mydb.board WHERE ID_PK=${id};`,
      (err, data) => {
        if (err) throw err;
        cb(data);
      },
    );
  },
};

module.exports = db;
