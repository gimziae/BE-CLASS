// @ts-check

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://eaizmig:ji78ji78!@cluster0.iak1xpi.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err, db) => {
  const user = client.db('kdt4-test').collection('user-test');

  //   user의 모든 데이터 삭제 후 콜백함수 받기!
  user.deleteMany({}, (err, deleteResult) => {
    if (deleteResult?.acknowledged) {
      user.insertMany(
        [
          {
            name: 'suzy',
            age: 7,
          },
          {
            name: 'nana',
            age: 4,
          },
          {
            name: 'jiae',
            age: 5,
          },
        ],
        (err, insertResult) => {
          if (insertResult?.acknowledged) {
            // 커서에 담는다 find(조건에 맞는거 전체) != findeOne(조건에 맞는 첫번째 데이터 하나만)
            const cursor = user.find({
              $or: [{ age: { $gte: 5 } }, { name: 'nana' }],
            });

            // 커서를 배열로 바꾼 뒤 콜백함수로 데이터를 뽑아낸가
            cursor.toArray((err, data) => {
              console.log(data);
            });

            // 같은 방법이긴 하나 출력된 값을 배열로 받기위해선 toArray()를 사용한다.
            // cursor.forEach((el) => {
            //   console.log(el);
            // });

            // // 모든 데이터를 가지고 와라 {} == mysql 에서 *과 같다
            // const findDataCursor = user.find({});
            // findDataCursor.toArray((err, data) => {
            //   console.log(data);
            //   client.close();
            // });
          }
        },
      );
    }
  });
});
