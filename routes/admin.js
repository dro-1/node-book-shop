const express = require("express");

const router = express.Router();

router.get("/add-product", (req, res, next) => {
  res.send(`<html>
    <title>My First Server</title>
    <body>
    <h1>Welcome to the Form Page</h1>
    <form action='/product' method='POST'>
    <input type='text' name='message' />
    <button type='submit'>Send IT!</button>
    </form>
    </body>
    </html>`);
});

router.post("/product", (req, res) => {
  console.log(req.body.message);
  res.redirect("/");
});

module.exports = router;
