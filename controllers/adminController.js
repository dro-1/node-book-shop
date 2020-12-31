const Product = require("./../models/product");

exports.getAddProducts = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Products",
    path: "/admin/add-product",
  });
};

exports.postAddProducts = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

exports.getAdminProducts = (req, res) => {
  Product.fetchAll((products) => {
    console.log(products);
    res.render("admin/products", {
      pageTitle: "Admin Products List",
      path: "/admin/products",
      products,
    });
  });
};
