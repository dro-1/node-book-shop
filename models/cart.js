const rootDir = require("./../util/path");
const path = require("path");
const fs = require("fs");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    let cart = {
      products: [],
      totalPrice: 0.0,
    };
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      let existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      let existingProduct = cart.products[existingProductIndex];
      if (existingProduct) {
        let updatedProduct = {
          ...existingProduct,
          qty: existingProduct.qty + 1,
        };
        cart.products[existingProductIndex] = updatedProduct;
        cart.totalPrice = cart.totalPrice + existingProduct.price;
        console.log(cart.totalPrice);
        cart.totalPrice = Number(cart.totalPrice.toFixed(2));
      } else {
        cart.products.push({
          id,
          price: productPrice,
          qty: 1,
        });
        cart.totalPrice = cart.totalPrice + productPrice;
        console.log(cart.totalPrice);
        cart.totalPrice = Number(cart.totalPrice.toFixed(2));
      }

      console.log(cart);
      fs.writeFile(p, JSON.stringify(cart), (err) =>
        err ? console.log(err) : null
      );
    });
  }

  static deleteProduct(id, cb) {
    let cart;
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      let productIndex = cart.products.findIndex(
        (inProduct) => inProduct.id === Number(id)
      );
      if (productIndex === -1) {
        return;
      }
      let product = cart.products[productIndex];
      let newCart = {
        ...cart,
        products: cart.products.filter(
          (inProduct) => inProduct.id !== Number(id)
        ),
      };
      newCart.totalPrice = cart.totalPrice - product.price * product.qty;
      newCart.totalPrice = Number(newCart.totalPrice.toFixed(2));

      console.log(newCart);
      fs.writeFile(p, JSON.stringify(newCart), (err) =>
        err ? console.log(err) : cb()
      );
    });
  }

  static decreaseProduct(id, cb) {
    //get the product and reduce the quantity by 1
    let cart;
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      let existingProductIndex = cart.products.findIndex(
        (product) => product.id === Number(id)
      );
      console.log(existingProductIndex);
      let existingProduct = cart.products[existingProductIndex];

      if (existingProduct.qty === 1) {
        return this.deleteProduct(id, cb);
      } else {
        cart.products[existingProductIndex] = {
          ...existingProduct,
          qty: existingProduct.qty - 1,
        };
      }
      cart.totalPrice = cart.totalPrice - existingProduct.price;
      cart.totalPrice = Number(cart.totalPrice.toFixed(2));
      console.log(cart);
      fs.writeFile(p, JSON.stringify(cart), (err) =>
        err ? console.log(err) : cb()
      );
    });
  }

  static getProducts(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        let cart = JSON.parse(fileContent);
        cb(cart);
      }
    });
  }
};
