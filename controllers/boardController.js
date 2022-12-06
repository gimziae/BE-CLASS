// @ts-check
const req = require('express/lib/request');
const { ObjectId } = require('mongodb');

const mongoClient = require('./mongoConnect'); // 몽고디비에 접속할 수 있는 모듈 생성

const db = {
  getAllArticles: async () => {
    // 일단 몽고 서버에 접속!!
    const client = await mongoClient.connect();
    // 서버의 kdt4의 board의 테이블에 접속!
    const board = client.db('kdt4').collection('board');

    // 전체 데이터 찾아서 가져오기
    const allArticlesCursor = board.find({});
    const allArticles = await allArticlesCursor.toArray(); // 받은 데이터들 배열로 변환
    return allArticles;
  },

  // 새로운 글 작성하기
  writeArticle: async (newArticle) => {
    const client = await mongoClient.connect();
    const board = client.db('kdt4').collection('board');

    // 받은 값들을 읽을 수 있게 할당해준다! (라우터에서 나중에 변경해줘도 됨.)
    // const writeArticle = {
    //   USER_ID: newArticle.id,
    //   TITLE: newArticle.title,
    //   CONTENT: newArticle.content,
    // };

    // 입력 결과값
    const writeResult = await board.insertOne(newArticle);
    if (!writeResult.acknowledged) throw new Error('글 쓰기 실패');
    return true;
  },

  // 특정 ID_PK를 가지는 게시글 찾기
  getArticle: async (id) => {
    const client = await mongoClient.connect();
    const board = client.db('kdt4').collection('board');

    const findArticle = await board.findOne({ _id: ObjectId(id) });
    if (!findArticle) return false; // 못찾았으면 false
    return findArticle; // 찾으면 찾은 게시글 데이터 넘기기
  },

  // 특정 ID_PK를 가지는 게시글 수정하기
  // img가 주어 질 경우 img를 인자로 줘야댐!
  modifyArticle: async (id, modifyArticle, img) => {
    try {
      const client = await mongoClient.connect();
      const board = client.db('kdt4').collection('board');

      // 수정사항 객체로 만들기
      const finalModifyAricle = {
        TITLE: modifyArticle.title,
        CONTENT: modifyArticle.content,
      };

      // 이미지파일이 있다면!
      if (img !== undefined) finalModifyAricle.IMAGE = img.filename;

      const updateResult = await board.updateOne(
        { _id: ObjectId(id) },
        {
          $set: finalModifyAricle,
        },
      );
      if (!updateResult.acknowledged) throw new Error('수정 실패');
      return true;
    } catch (err) {
      console.error(err);
    }
  },

  // 특정 ID_PK를 가지는 게시글 삭제하기
  deleteArticle: async (id) => {
    const client = await mongoClient.connect();
    const board = client.db('kdt4').collection('board');

    const deleteResult = await board.deleteOne({ _id: ObjectId(id) });
    if (!deleteResult.acknowledged) throw new Error('게시글 삭제 실패');
    return deleteResult;
  },
};

module.exports = db;
