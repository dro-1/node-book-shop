const express = require("express");

const router = express.Router();

const adminController = require("./../controllers/adminController");

const isAuth = require("./../middleware/isAuth");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.deleteProduct);

router.get("/products", isAuth, adminController.getAdminProducts);

module.exports = router;
