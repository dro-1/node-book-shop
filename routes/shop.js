const express = require("express");
const path = require("path");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", {
    pageTitle: "Shop",
    path: "/",
    products,
  });
});

module.exports = router;
