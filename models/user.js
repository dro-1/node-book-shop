const { getDb } = require("./../util/database");
const { ObjectID } = require("mongodb");

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((resp) => {
        console.log(resp);
        console.log("User Saved");
      })
      .catch(console.log);
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: ObjectID(id) })
      .next()
      .then((user) => {
        if (user) {
          console.log("User Found");
          return user;
        }
        throw "No User Found";
      })
      .catch(console.log);
  }
}

module.exports = User;
