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
      } else {
        cart.products.push({
          id,
          price: productPrice,
          qty: 1,
        });
        cart.totalPrice = cart.totalPrice + productPrice;
        cart.totalPrice = cart.totalPrice.toFixed(2);
      }
      console.log(cart);
      fs.writeFile(p, JSON.stringify(cart), (err) =>
        err ? console.log(err) : null
      );
    });
  }
};
