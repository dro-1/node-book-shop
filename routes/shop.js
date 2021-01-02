const express = require("express");

const shopController = require("./../controllers/shopController");

const router = express.Router();

router.get("/", shopController.getIndexPage);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.get("/orders", shopController.getOrders);

router.get("/products", shopController.getProducts);

router.post("/cart-delete-item", shopController.deleteCartItem);

router.post("/cart-decrease-item", shopController.decreaseCartItem);

router.get("/products/:productId", shopController.getProduct);

module.exports = router;
