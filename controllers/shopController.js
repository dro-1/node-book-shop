const Product = require("./../models/product");
const User = require("../models/user");
//const Cart = require("./../models/cart");

exports.getIndexPage = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        pageTitle: "Shop Index Page",
        path: "/",
        products,
      });
    })
    .catch(console.log);
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        pageTitle: "Product List Page",
        path: "/products",
        products,
      });
    })
    .catch(console.log);
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      console.log(product);
      if (product) {
        res.render("shop/product-detail", {
          pageTitle: product.title,
          path: `/products`,
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

exports.getCart = (req, res) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    cart: {
      products: req.user.cart.items,
    },
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  const { _id, username, email, cart } = req.user;
  const user = new User(username, email, cart);
  Product.findById(productId)
    .then((product) => {
      user
        .addToCart(product, _id)
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
  const { _id, username, email, cart } = req.user;
  const user = new User(username, email, cart);
  Product.findById(productId)
    .then((product) => {
      user
        .deleteFromCart(product, _id)
        .then((resp) => {
          //console.log("Item Deleted From Cart");
          res.redirect("/cart");
        })
        .catch(console.log);
    })
    .catch(console.log);
};

exports.decreaseCartItem = (req, res, next) => {
  const { productId } = req.body;
  const { _id, username, email, cart } = req.user;
  const user = new User(username, email, cart);
  Product.findById(productId)
    .then((product) => {
      user
        .decreaseCartItem(product, _id)
        .then((resp) => {
          console.log("Item Decreased From Cart");
          res.redirect("/cart");
        })
        .catch(console.log);
    })
    .catch(console.log);
};

exports.createOrder = (req, res) => {
  const { user } = req;
  let products;
  let fetchedCart;
  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((cartProducts) => {
      if (cartProducts.length > 0) {
        products = cartProducts;
        return user.createOrder();
      } else {
        return res.redirect("/cart");
      }
    })
    .then((order) => {
      console.log(order);
      order.addProducts(
        products.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      );
    })
    .then(() => {
      //fetchedCart.setProducts(null)
      return fetchedCart.removeProducts(products);
    })
    .then((resp) => {
      res.redirect("/orders");
    })
    .catch(console.log);
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders,
      });
    })
    .catch(console.log);
};
