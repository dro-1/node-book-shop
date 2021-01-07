const Product = require("./../models/product");

exports.getAddProduct = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getEditProduct = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          product,
          isAuthenticated: req.session.isLoggedIn,
        });
      } else {
        res.status(404).render("404", {
          pageTitle: "Page Not Found",
          path: "",
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.session.user,
  });
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
  Product.findOne({ userId: req.session.user._id, _id: id })
    .then((product) => {
      if (!product) {
        res.redirect("/admin/products");
        throw "Product not found";
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save();
    })
    .then(() => {
      console.log("Product Edited Successfully");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res) => {
  const { id } = req.body;
  Product.deleteOne({ userId: req.session.user._id, _id: id })
    .then((resp) => {
      if (!resp.deletedCount) {
        res.redirect("/admin/products");
        throw "Product not found";
      }
      console.log("Product Deleted");
      res.redirect("/admin/products");
    })
    .catch(console.log);
};

exports.getAdminProducts = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  Product.find({ userId: req.session.user._id })
    //.select()
    //.populate()
    .then((products) => {
      res.render("admin/products", {
        pageTitle: "Admin Products List",
        path: "/admin/products",
        products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.log);
};
