const express = require("express");

const shopController = require("./../controllers/shopController");

const router = express.Router();

router.get("/", shopController.getIndexPage);

router.get("/cart", shopController.getCart);

router.get("/orders", shopController.getOrders);

router.get("/products", shopController.getProducts);

module.exports = router;
