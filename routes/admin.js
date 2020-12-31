const express = require("express");

const router = express.Router();

const adminController = require("./../controllers/adminController");

router.get("/add-product", adminController.getAddProduct);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/add-product", adminController.postAddProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.deleteProduct);

router.get("/products", adminController.getAdminProducts);

module.exports = router;
