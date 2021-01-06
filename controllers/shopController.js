const Product = require("./../models/product");
const User = require("../models/user");
const Order = require("../models/order");

exports.getIndexPage = (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Shop Index Page",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
        products,
      });
    })
    .catch(console.log);
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "Product List Page",
        path: "/products",
        products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.log);
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      if (product) {
        res.render("shop/product-detail", {
          pageTitle: product.title,
          path: `/products`,
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

exports.getCart = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  req.session.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        cart: {
          products: user.cart.items,
        },
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      req.session.user
        .addToCart(product)
        .then((resp) => {
          console.log("Item Added To Cart");
          res.redirect("/cart");
        })
        .catch(console.log);
    })
    .catch(console.log);
};

exports.deleteCartItem = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      req.session.user
        .deleteFromCart(product)
        .then((resp) => {
          console.log("Item Deleted From Cart");
          res.redirect("/cart");
        })
        .catch(console.log);
    })
    .catch(console.log);
};

exports.decreaseCartItem = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      req.session.user
        .decreaseFromCart(product)
        .then((resp) => {
          console.log("Item Decreased From Cart");
          res.redirect("/cart");
        })
        .catch(console.log);
    })
    .catch(console.log);
};

exports.createOrder = (req, res) => {
  const { _id, username, email, cart } = req.session.user;
  const user = new User(username, email, cart);

  req.session.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => ({
        product: { ...item.productId._doc },
        quantity: item.quantity,
      }));

      const order = new Order({
        products,
        amount: user.cart.totalPrice,
        user: {
          name: user.name,
          userId: user,
        },
      });
      return order.save();
    })
    .then((resp) => {
      console.log("Order Saved");
      return req.session.user.clearCart();
    })
    .then((resp) => {
      console.log(resp);
      res.redirect("/cart");
    })
    .catch(console.log);
};

exports.getOrders = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.log);
};
