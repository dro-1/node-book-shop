const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const adminController = require("./../controllers/adminController");

const isAuth = require("./../middleware/isAuth");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/add-product",
  isAuth,
  [
    body("title", "Title should be 2 or more alphanumeric characters")
      .trim()
      .isLength({ min: 3 }),
    //body("imageUrl", "Enter a valid url").isURL(),
    body("price", "Price must be a number greater than 0").isFloat({ gt: 0.0 }),
    body("description", "Description must have 5 or more characters")
      .trim()
      .isLength({
        min: 5,
      }),
  ],
  adminController.postAddProduct
);

router.post(
  "/edit-product",
  isAuth,
  [
    body("title", "Title should be 2 or more alphanumeric characters")
      .trim()
      .isLength({ min: 3 }),
    // body("imageUrl", "Enter a valid url").isURL(),
    body("price", "Price must be a number greater than 0").isFloat({ gt: 0.0 }),
    body("description", "Description must have 5 or more characters")
      .trim()
      .isLength({
        min: 5,
      }),
  ],
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.deleteProduct);

router.get("/products", isAuth, adminController.getAdminProducts);

module.exports = router;
