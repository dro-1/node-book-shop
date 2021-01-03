const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const MONGO_URI =
  process.env.MONGODB_URI ||
  `mongodb+srv://dro:pword1234@cluster0.ytwpa.mongodb.net/test?retryWrites=true&w=majority`;

const connector = (cb) => {
  MongoClient.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((result) => {
      console.log("DB Connected");
      cb(result);
    })
    .catch(console.log);
};

module.exports = connector;
