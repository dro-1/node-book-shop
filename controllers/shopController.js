const Product = require("./../models/product");
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
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((resp) => {
      const products = resp.map((re) => ({
        ...re.dataValues,
        qty: re.dataValues.cartItem.quantity,
      }));
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        cart: {
          products,
        },
      });
    });
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
