const Product = require("./../models/product");
const Cart = require("./../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        pageTitle: "Shop",
        path: "/products",
        products: rows,
      });
    })
    .catch(console.log);
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(product.id, Number(product.price));
    res.redirect("/cart");
  });
};

exports.deleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  Cart.deleteProduct(productId, () => res.redirect("/cart"));
};

exports.decreaseCartItem = (req, res, next) => {
  const { productId } = req.body;
  Cart.decreaseProduct(productId, () => res.redirect("/cart"));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(([[product], fieldData]) => {
      if (product) {
        console.log(product);
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

exports.getIndexPage = (req, res) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        pageTitle: "Shop Index Page",
        path: "/",
        products: rows,
      });
    })
    .catch(console.log);
};

exports.getCart = (req, res) => {
  Cart.getProducts((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      products.forEach((product) => {
        let productInCart = cart.products.find(
          (cartProduct) => cartProduct.id == product.id
        );
        if (productInCart) {
          cartProducts.push({ ...product, qty: productInCart.qty });
        }
      });
      console.log(cartProducts);
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        cart: {
          totalPrice: cart.totalPrice,
          products: cartProducts,
        },
      });
    });
  });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
