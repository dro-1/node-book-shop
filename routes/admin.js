const express = require("express");
const path = require("path");
const rootDir = require("./../util/path");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    formCSS: true,
    productCSS: true,
    isProductActive: true,
  });
});

router.post("/add-product", (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.router = router;
exports.products = products;
