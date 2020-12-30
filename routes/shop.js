const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("<h1>Hello World From Express Home</h1>");
  next();
});

module.exports = router;
