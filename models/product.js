const products = [];
const rootDir = require("./../util/path");
const path = require("path");
const fs = require("fs");

const p = path.join(rootDir, "data", "products.json");
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      console.log(err);
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      this.id = products.length;
      products.push(this);
      fs.writeFile(p, JSON.stringify(products));
    });
    return this;
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === Number(id));
      cb(product);
    });
  }
};
