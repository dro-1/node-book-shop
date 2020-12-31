const Product = require("./../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    console.log(products);
    res.render("shop/product-list", {
      pageTitle: "Shop",
      path: "/products",
      products,
    });
  });
};

exports.getIndexPage = (req, res) => {
  Product.fetchAll((products) => {
    console.log(products);
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
