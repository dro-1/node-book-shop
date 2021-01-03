const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let db;
const MONGO_URI =
  process.env.MONGODB_URI ||
  `mongodb+srv://dro:pword1234@cluster0.ytwpa.mongodb.net/test?retryWrites=true&w=majority`;

const connector = (cb) => {
  MongoClient.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((client) => {
      console.log("DB Connected");
      db = client.db("shop");
    })
    .catch(console.log);
};

const getDb = () => {
  if (db) {
    return db;
  }
  throw "DB Not Found!";
};

module.exports = {
  connector,
  getDb,
};
