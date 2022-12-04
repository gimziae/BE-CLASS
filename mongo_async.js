// @ts-check

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://eaizmig:ji78ji78!@cluster0.iak1xpi.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function main() {
  await client.connect();
  const user = client.db('kdt4').collection('member');

  // 초기화
  const deleteResult = await user.deleteMany({});
  if (!deleteResult.acknowledged) throw new Error('샥재 이상');

  // 초기데이터 삽입
  const insertResult = await user.insertMany([
    {
      id: 'tetz',
      name: '이효석',
      isMarried: false,
      age: 38,
    },
    {
      id: 'eric',
      name: '김성재',
      isMarried: true,
      age: 38,
    },
    {
      id: 'ailee',
      name: '이재연',
      isMarried: false,
      age: 35,
    },
    {
      id: 'alex',
      name: '하승호',
      isMarried: false,
      age: 34,
    },
    {
      id: 'uncle',
      name: '박동희',
      isMarried: true,
      age: 38,
    },
  ]);
  if (!insertResult.acknowledged) throw new Error('삽입 이상');

  // 추가데이터
  const addResult = await user.insertOne({
    id: 'ted',
    name: '방성민',
    isMarried: false,
    age: 37,
  });
  if (!addResult.acknowledged) throw new Error('추가데이터 이상');

  // 데이터 수정
  const updateOneResult = await user.updateOne(
    { id: 'ted' },
    { $set: { isMarried: true } },
  );
  if (!updateOneResult.acknowledged) throw new Error('데이터 수정 이상');

  // 시간 데이터 삽입
  const updateManyResult = await user.updateMany(
    {},
    { $set: { updateTime: new Date(Date.now()) } },
  );
  if (!updateManyResult.acknowledged)
    throw new Error('새로운 데이터 삽입 실패');

  // 전체 데이터 출력 코드
  const dataCursor = user.find({});
  const data = await dataCursor.toArray();
  console.log(data);

  // 데이터 하나만 출력
  // const data = await user.findOne({});
  // console.log(data)

  await client.close();
}

main();
