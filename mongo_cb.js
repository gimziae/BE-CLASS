// @ts-check

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://eaizmig:ji78ji78!@cluster0.iak1xpi.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  const user = client.db('kdt4').collection('user');

  user.deleteMany({}, (err, deleteResult) => {
    if (deleteResult?.acknowledged) {
      user.insertMany(
        [
          {
            name: 'zaezae',
            age: 29,
          },
          {
            name: 'nana',
            age: 25,
          },
          {
            name: 'gaga',
            age: 22,
          },
        ],
        (err, insertResult) => {
          if (insertResult?.acknowledged) {
            user.updateMany(
              { age: { $gte: 25 } },
              { $set: { name: '25살 이상' } },
              (err, updateManyResult) => {
                if (updateManyResult?.acknowledged) {
                  //   cursor는 위치만 알려줌
                  const findCursor = user.find({});
                  findCursor.toArray((err, data) => {
                    console.log(data);
                    client.close();
                  });
                }
              },
            );
          }
        },
      );
    }
  });
});
