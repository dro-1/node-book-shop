const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const mongoDbConnector = require("./util/database");

app.set("view engine", "ejs");
app.set("views", "views");

// const adminRoutes = require("./routes/admin");
// const shopRouter = require("./routes/shop");
const Controller404 = require("./controllers/404");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(console.log);
});

// app.use("/admin", adminRoutes);

// app.use(shopRouter);

app.use(Controller404.get404Page);

mongoDbConnector((result) => {
  console.log(result);
  app.listen(3000, "dro");
});
