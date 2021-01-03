const { getDb } = require("./../util/database");
const { ObjectID } = require("mongodb");
class Product {
  constructor(title, description, price, imageUrl, id) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this._id = id ? ObjectID(id) : null;
  }

  save() {
    const db = getDb();
    if (this._id) {
      return db.collection("products").updateOne(
        {
          _id: this._id,
        },
        {
          $set: this,
        }
      );
    }
    return db.collection("products").insertOne(this);
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("products").find().toArray();
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: ObjectID(id) })
      .next();
  }

  static deleteById(id) {
    const db = getDb();
    return db.collection("products").deleteOne({ _id: ObjectID(id) });
  }
}

module.exports = Product;
