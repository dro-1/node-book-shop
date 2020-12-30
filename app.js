const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.set("view engine", "pug");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.router);

app.use(shopRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404page.html"));
});

app.listen(3000, "dro");
