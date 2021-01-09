const express = require("express");

const shopController = require("./../controllers/shopController");

const isAuth = require("./../middleware/isAuth");

const router = express.Router();

router.get("/", shopController.getIndexPage);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/products", shopController.getProducts);

router.post("/cart-delete-item", isAuth, shopController.deleteCartItem);

router.post("/create-order", isAuth, shopController.createOrder);

router.post("/cart-decrease-item", isAuth, shopController.decreaseCartItem);

router.get("/products/:productId", shopController.getProduct);

router.get("/order/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
