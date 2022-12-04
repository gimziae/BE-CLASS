// @ts-check
const connection = require('./dbConnect'); // db에 접속할 수 있는 모듈 연결 선언

const db = {
  getUsers: (cb) => {
    // sql에서 데이터를 가져와라
    connection.query('SELECT * FROM mydb.user', (err, data) => {
      if (err) throw err;
      console.log(data);
      cb(data);
    });
  },

  // 유저 중복 체크
  userCheck: (userId, cb) => {
    connection.query(
      `select * from mydb.user where USER_ID = '${userId}';`,
      (err, data) => {
        if (err) throw err;
        cb(data);
      },
    );
  },

  // 회원가입
  registerUser: (newUser, cb) => {
    connection.query(
      `insert into mydb.user (USER_ID, PASSWORD) values ('${newUser.id}', '${newUser.password}');`,
      (err, data) => {
        if (err) throw err;
        cb(data);
      },
    );
  },
};

module.exports = db;
