const { getDb } = require("./../util/database");
const { ObjectID } = require("mongodb");

class User {
  constructor(username, email, cart) {
    this.username = username;
    this.email = email;
    this.cart = cart;
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

  addToCart(product, id) {
    const db = getDb();
    let existingCartItemIndex = this.cart.items.findIndex(
      (item) => item.productId.toString() === ObjectID(product._id).toString()
    );
    let existingCartItem = this.cart.items[existingCartItemIndex];
    let updatedCart = this.cart;
    if (existingCartItemIndex === -1) {
      updatedCart.items.push({
        productId: ObjectID(product._id),
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    } else {
      updatedCart.items[existingCartItemIndex] = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
    }
    updatedCart.totalPrice += product.price;
    updatedCart.totalPrice = Number(updatedCart.totalPrice.toFixed(2));
    return db.collection("users").updateOne(
      {
        _id: ObjectID(id),
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

  deleteFromCart(product, id) {
    const db = getDb();
    let updatedCart = this.cart;

    const productID = product.productId ? product.productId : product._id;
    updatedCart.items = this.cart.items.filter(
      (item) => item.productId.toString() !== ObjectID(productID).toString()
    );
    console.log(updatedCart);
    updatedCart.totalPrice =
      updatedCart.totalPrice - product.quantity * product.price;
    updatedCart.totalPrice = Number(updatedCart.totalPrice.toFixed(2));
    return db.collection("users").updateOne(
      {
        _id: ObjectID(id),
      },
      {
        $set: {
          cart: updatedCart,
        },
      }
    );
  }

  decreaseCartItem(product, id) {
    const db = getDb();
    let existingCartItemIndex = this.cart.items.findIndex(
      (item) => item.productId.toString() === ObjectID(product._id).toString()
    );
    let existingCartItem = this.cart.items[existingCartItemIndex];
    let updatedCart = this.cart;
    if (existingCartItem.quantity === 1) {
      return this.deleteFromCart(existingCartItem, id, true);
    } else {
      updatedCart.items[existingCartItemIndex] = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedCart.totalPrice -= product.price;
      updatedCart.totalPrice = Number(updatedCart.totalPrice.toFixed(2));
      return db.collection("users").updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: {
            cart: updatedCart,
          },
        }
      );
    }
  }

  placeOrder(id){
    const db = getDb()
   return db.collection('orders').insertOne({
      ...this.cart,
      userId: id
    })
    .then(resp=>{
      let updatedCart = { items: [], totalPrice: 0}
      return db.collection("users").updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: {
            cart: updatedCart,
          },
        }
      );
    })
    .catch(console.log)
  }

  static fetchOrders(id){
    const db = getDb();
    return db.collection('orders').find({userId: id}).toArray()
  }

  // getCart() {
  //   const db = getDb();
  //   let cartItemIds = []
  //   return db.collection("products").find({
  //     _id: {
  //       $in : cartItemIds
  //     }
  //   });
  // }

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
