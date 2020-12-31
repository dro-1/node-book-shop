const Product = require("./../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "Shop",
      path: "/products",
      products,
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    res.render("shop/cart", {
      pageTitle: "Cart",
      path: "/cart",
      product,
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    if (product) {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: `/products`,
        product,
      });
    } else {
      res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
    }
  });
};

exports.getIndexPage = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      pageTitle: "Shop Index Page",
      path: "/",
      products,
    });
  });
};

exports.getCart = (req, res) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
