// @ts-check
const mongoClient = require('./mongoConnect'); // 몽고디비에 접속할 수 있는 모듈 생성

const db = {
  // getUsers: (cb) => {
  //   // sql에서 데이터를 가져와라
  //   connection.query('SELECT * FROM mydb.user', (err, data) => {
  //     if (err) throw err;
  //     console.log(data);
  //     cb(data);
  //   });
  // },

  // 유저 중복 체크
  userCheck: async (userId) => {
    const client = await mongoClient.connect(); // 일단 몽고디비에 접속!
    const user = client.db('kdt4').collection('user'); // user 데이터에 접근

    const findUser = await user.findOne({ id: userId }); // 한가지 데이터 접속
    if (!findUser) return false; // findUser 값이 없다면 false 를 리턴(W? null 값이 리턴되므로 임의적으로 false로 리턴해준다)
    return findUser; // 찾은 회원 정보 전달
  },

  // 회원가입
  registerUser: async (newUser) => {
    const client = await mongoClient.connect(); // 몽고디비에 접속
    const user = client.db('kdt4').collection('user'); // user 데이터에 접근

    const registerResult = await user.insertOne(newUser); // 데이터 추가
    if (!registerResult.acknowledged) throw new Error('회원 등록 실패'); // 실패 시 에러
    return true; // 성공 시 true 반환
  },
};

module.exports = db;
