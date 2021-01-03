const { getDb } = require("./../util/database");
const { ObjectID } = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this.id = id;
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

  addCart(product) {
    const db = getDb();
    let existingCartItemIndex = this.cart.items.findIndex(
      (item) => item._id === ObjectID(product._id)
    );
    let existingCartItem = updatedCart.items[existingCartItemIndex];
    let updatedCart = this.cart;
    if (existingCartItemIndex === -1) {
      updatedCart.items.push(product);
    } else {
      updatedCart.items[existingCartItemIndex] = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
    }
    updatedCart.totalPrice += product.price;
    return db.collection("users").updateOne(
      {
        _id: ObjectID(this.id),
      },
      {
        $set: {
          username: this.username,
          email: this.email,
          cart: updatedCart,
        },
      }
    );
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
