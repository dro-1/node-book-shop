const Product = require("./../models/product");
const Cart = require("./../models/cart");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((resp) => {
      const products = resp.map((re) => ({ ...re.dataValues }));
      res.render("shop/product-list", {
        pageTitle: "Product List Page",
        path: "/products",
        products,
      });
    })
    .catch(console.log);
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((cartProducts) => {
      let cartProduct;
      if (cartProducts.length > 0) {
        cartProduct = cartProducts[0];
        newQuantity = cartProduct.cartItem.quantity + 1;
        return cartProduct;
      } else {
        return Product.findByPk(productId);
      }
    })
    .then((product) => {
      fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch(console.log);
};

exports.deleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.removeProduct(productId);
    })
    .then((resp) => {
      res.redirect("/cart");
    })
    .catch(console.log);
};

exports.decreaseCartItem = (req, res, next) => {
  const { productId } = req.body;
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((cartProducts) => {
      if (cartProducts.length > 0) {
        return cartProducts[0];
      } else {
        throw Error;
      }
    })
    .then((product) => {
      if (product.cartItem.quantity == 1) {
        return fetchedCart.removeProduct(productId);
      }
      fetchedCart.addProduct(product, {
        through: { quantity: product.cartItem.quantity - 1 },
      });
    })
    .then((resp) => {
      console.log(resp);
      res.redirect("/cart");
    })
    .catch(console.log);
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findByPk(productId)
    .then(({ dataValues }) => {
      if (dataValues) {
        console.log(dataValues);
        res.render("shop/product-detail", {
          pageTitle: dataValues.title,
          path: `/products`,
          product: dataValues,
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
  Product.findAll()
    .then((resp) => {
      const products = resp.map((re) => ({ ...re.dataValues }));
      res.render("shop/index", {
        pageTitle: "Shop Index Page",
        path: "/",
        products,
      });
    })
    .catch(console.log);
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((resp) => {
      const products = resp.map((re) => ({
        ...re.dataValues,
        qty: re.dataValues.cartItem.quantity,
      }));
      console.log(products);
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        cart: {
          products,
        },
      });
    });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};
