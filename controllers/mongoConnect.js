// @ts-check

const { connect } = require('http2');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://eaizmig:ji78ji78!@cluster0.iak1xpi.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;
