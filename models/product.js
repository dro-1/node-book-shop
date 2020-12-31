const products = [];
const rootDir = require("./../util/path");
const path = require("path");
const fs = require("fs");

const p = path.join(rootDir, "data", "products.json");
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      console.log(err, "Reading Products File Error");
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const oldProductIndex = products.findIndex(
          (product) => product.id === Number(this.id)
        );
        const oldProduct = products[oldProductIndex];
        const { id, title, imageUrl, price, description } = this;
        const newProduct = {
          id,
          title,
          imageUrl,
          price,
          description,
        };
        products[oldProductIndex] = newProduct;
      } else {
        this.id = products.length;
        products.push(this);
      }
      fs.writeFile(p, JSON.stringify(products), console.log);
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

  static delete(id, cb) {
    getProductsFromFile((products) => {
      const newProducts = products.filter(
        (product) => product.id !== Number(id)
      );
      fs.writeFile(p, JSON.stringify(newProducts), console.log);
      cb();
    });
  }
};
