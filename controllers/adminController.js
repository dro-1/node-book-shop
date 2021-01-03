const Product = require("./../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
  });
};

exports.getEditProduct = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          product,
        });
      } else {
        res
          .status(404)
          .render("404", { pageTitle: "Page Not Found", path: "" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(
    title,
    description,
    Number(price),
    imageUrl,
    null,
    req.user._id
  );
  product
    .save()
    .then((resp) => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch(console.log);
};

exports.postEditProduct = (req, res) => {
  const { title, imageUrl, price, description, id } = req.body;
  const product = new Product(title, description, price, imageUrl, id);
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res) => {
  const { id } = req.body;
  Product.deleteById(id)
    .then((resp) => {
      res.redirect("/admin/products");
    })
    .catch(console.log);
};

exports.getAdminProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products List",
        path: "/admin/products",
        products,
      });
    })
    .catch(console.log);
};
