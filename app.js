const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const sequelize = require("./util/database");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const Controller404 = require("./controllers/404");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);

app.use(shopRouter);

app.use(Controller404.get404Page);

sequelize
  .sync()
  .then((resp) => {
    //console.log(resp);
    app.listen(3000, "dro");
  })
  .catch(console.log);
