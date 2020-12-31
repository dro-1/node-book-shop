const Product = require("./../models/product");

exports.getAddProducts = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
  });
};

exports.getEditProducts = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    if (product) {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
      });
    } else {
      res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
    }
  });
};

exports.postAddProducts = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect("/admin/products");
};

exports.postEditProducts = (req, res) => {
  const { title, imageUrl, price, description, id } = req.body;
  const product = new Product(id, title, imageUrl, price, description);
  product.save();
  res.redirect("/admin/products");
};

exports.getAdminProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      pageTitle: "Admin Products List",
      path: "/admin/products",
      products,
    });
  });
};
