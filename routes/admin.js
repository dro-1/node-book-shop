const express = require("express");

const router = express.Router();

const adminController = require("./../controllers/adminController");

router.get("/add-product", adminController.getAddProducts);

router.get("/edit-product/:productId", adminController.getEditProducts);

router.post("/add-product", adminController.postAddProducts);

router.post("/edit-product", adminController.postEditProducts);

router.get("/products", adminController.getAdminProducts);

module.exports = router;
