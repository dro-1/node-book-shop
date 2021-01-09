const Product = require("./../models/product");

const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
    isAdding: true,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: "",
    oldInput: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
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
          isAdding: false,
          errorMessage: "",
          oldInput: {
            title: "",
            imageUrl: "",
            price: "",
            description: "",
          },
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
  const { title, price, description } = req.body;
  const image = req.file;
  if (!image) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      product: {},
      isAdding: true,
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: "Invalid Image Sent",
      oldInput: {
        title,
        price,
        description,
      },
    });
  }

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors = errors.array();
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      product: {},
      isAdding: true,
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: errors[0].msg,
      oldInput: {
        title,
        price,
        description,
      },
    });
  }
  const product = new Product({
    title,
    price: parseFloat(price),
    imageUrl: "/" + image.path,
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
  const { title, price, description, id } = req.body;
  const image = req.file;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors = errors.array();
    return res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      product: { _id: id },
      isAuthenticated: req.session.isLoggedIn,
      isAdding: false,
      errorMessage: errors[0].msg,
      oldInput: {
        title,
        price,
        description,
      },
    });
  }
  Product.findOne({ userId: req.session.user._id, _id: id })
    .then((product) => {
      if (!product) {
        res.redirect("/admin/products");
        throw "Product not found";
      }
      product.title = title;
      if (image) {
        product.imageUrl = "/" + image.path;
      }
      product.description = description;
      product.price = parseFloat(price);
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
