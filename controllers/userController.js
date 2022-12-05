// @ts-check
// 몽구스 커넥트
const connect = require('./mongooseConnect');

const User = require('../models/user');

connect();

const db = {
  // 유저 중복 체크
  userCheck: async (userId) => {
    try {
      const findUser = await User.findOne({ id: userId });
      console.log(findUser);
      if (!findUser) return false;
      return findUser;
    } catch (err) {
      console.error(err);
      return { status: 'unexpected', err };
    }
  },

  // 회원가입
  registerUser: async (newUser) => {
    // 에러가 발생할 것 같은 코드가 잇을 때 서버가 죽지(app crashed - waiting for file changes before starting...) 않게 도와주는 코드 try&&catch
    try {
      const registerResult = await User.create(newUser);
      if (!registerResult) throw new Error('회원 등록 실패');
      return true;
    } catch (err) {
      console.error(err);
      if (err.code === 11000) return { status: 'duplicated' };
      return { status: 'unexpected', err };
    }
  },
};

module.exports = db;
