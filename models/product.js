const Cart = require("./cart");
const db = require("./../util/database");
module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save(cb) {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }

  static deleteById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === Number(id));
      const newProducts = products.filter(
        (product) => product.id !== Number(id)
      );
      fs.writeFile(p, JSON.stringify(newProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id);
        }
      });
      cb();
    });
  }
};
