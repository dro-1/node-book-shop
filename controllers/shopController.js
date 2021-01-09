const Product = require("./../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const PDFDocument = require("pdfkit");
const ITEM_PER_PAGE = 3;

exports.getIndexPage = (req, res) => {
  let totalNoOfProducts;
  const page = req.query.page || 1;
  Product.find()
    .countDocuments()
    .then((totalProducts) => {
      totalNoOfProducts = totalProducts;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      let totalPages = Math.ceil(totalNoOfProducts / ITEM_PER_PAGE);
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      res.render("shop/index", {
        pageTitle: "Shop Index Page",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
        products,
        pages,
        currentPage: Number(page),
      });
    })
    .catch(console.log);
};

exports.getProducts = (req, res, next) => {
  let totalNoOfProducts;
  const page = req.query.page || 1;
  Product.find()
    .countDocuments()
    .then((totalProducts) => {
      totalNoOfProducts = totalProducts;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((products) => {
      let totalPages = Math.ceil(totalNoOfProducts / ITEM_PER_PAGE);
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      res.render("shop/product-list", {
        pageTitle: "Product List Page",
        path: "/products",
        products,
        isAuthenticated: req.session.isLoggedIn,
        currentPage: Number(page),
        pages,
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
        price: user.cart.totalPrice,
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
          email: user.email,
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
      res.redirect("/orders");
    })
    .catch(console.log);
};

exports.getOrders = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(console.log);
};

exports.getInvoice = (req, res) => {
  const orderId = req.params.orderId;
  Order.findOne({ _id: orderId, "user.userId": req.session.user._id }).then(
    (order) => {
      if (!order) {
        return res.redirect("/orders");
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join(
        __dirname,
        "..",
        "data",
        "invoices",
        invoiceName
      );
      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline;filename=${invoiceName}`,
      });
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("Invoice");
      pdfDoc.text("------------------------------");
      order.products.forEach((p) => {
        pdfDoc
          .fontSize(18)
          .text(
            p.product.title + "       $" + p.product.price + " x " + p.quantity
          );
      });
      pdfDoc.fontSize(26).text("------------------------------");
      pdfDoc.fontSize(20).text("Total Price: $" + order.amount);
      pdfDoc.end();
      // fsPromises.readFile(invoicePath)
      //   .then((resp) => {
      //     res.set({
      //       "Content-Type": "application/pdf",
      //       //"Content-Disposition": `attachment;filename=${invoiceName}`,
      //     });
      //     res.send(resp);
      //   })
      //   .catch(console.log);
      // const file = fs.createReadStream(invoicePath);
      // res.set("Content-Type", "application/pdf");
      // file.pipe(res);
    }
  );
};
