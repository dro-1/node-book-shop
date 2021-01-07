const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
});

userSchema.methods.addToCart = function (product) {
  let existingCartItemIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );
  let existingCartItem = this.cart.items[existingCartItemIndex];
  let updatedCart = this.cart;
  if (existingCartItemIndex === -1) {
    updatedCart.items.push({
      productId: product._id,
      quantity: 1,
    });
  } else {
    updatedCart.items[existingCartItemIndex].quantity =
      existingCartItem.quantity + 1;
  }
  updatedCart.totalPrice += product.price;
  updatedCart.totalPrice = Number(updatedCart.totalPrice.toFixed(2));
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteFromCart = function (product) {
  let updatedCart = this.cart;
  const productID = product.productId ? product.productId : product._id;
  updatedCart.items = this.cart.items.filter((item) => {
    if (item.productId.toString() === productID.toString()) {
      product.quantity = item.quantity;
      return false;
    }
    return true;
  });
  console.log(product);
  updatedCart.totalPrice -= product.quantity * product.price;
  updatedCart.totalPrice = Number(updatedCart.totalPrice.toFixed(2));
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.decreaseFromCart = function (product) {
  let existingCartItemIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );
  let existingCartItem = this.cart.items[existingCartItemIndex];
  let updatedCart = this.cart;
  if (existingCartItem.quantity === 1) {
    const newProduct = product;
    newProduct.quantity = existingCartItem.quantity;
    return this.deleteFromCart(newProduct);
  } else {
    updatedCart.items[existingCartItemIndex].quantity =
      existingCartItem.quantity - 1;
    updatedCart.totalPrice -= product.price;
    updatedCart.totalPrice = Number(updatedCart.totalPrice.toFixed(2));
  }
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  this.cart.totalPrice = 0.0;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// placeOrder(id){
//   const db = getDb()
//  return db.collection('orders').insertOne({
//     ...this.cart,
//     userId: id
//   })
//   .then(resp=>{
//     let updatedCart = { items: [], totalPrice: 0}
//     return db.collection("users").updateOne(
//       {
//         _id: ObjectID(id),
//       },
//       {
//         $set: {
//           cart: updatedCart,
//         },
//       }
//     );
//   })
//   .catch(console.log)
// }

// static fetchOrders(id){
//   const db = getDb();
//   return db.collection('orders').find({userId: id}).toArray()
// }

// static findById(id) {
//   const db = getDb();
//   return db
//     .collection("users")
//     .find({ _id: ObjectID(id) })
//     .next()
//     .then((user) => {
//       if (user) {
//         console.log("User Found");
//         return user;
//       }
//       throw "No User Found";
//     })
//     .catch(console.log);
// }
