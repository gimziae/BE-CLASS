module.exports = {
  extends: ['airbnb-base'],
  rules: {
    'no-console': 'off', // 콘솔 오류를 없애기 위해??
    'no-plusplus': 'off', // i++ 쓸 수 있게 해준다 > i += i;
    // 'linebreak-style': 0,  window 사용 시 추가해줘야 CRLF 문제 해결이 가능하다.
  },
};
