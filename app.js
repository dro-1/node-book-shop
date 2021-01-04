const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const connector = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const Controller404 = require("./controllers/404");
//const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   User.findById("5ff1f9613bfe0d19dceec537")
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch(console.log);
// });

app.use("/admin", adminRoutes);

app.use(shopRouter);

app.use(Controller404.get404Page);

connector(() => {
  // const user = new User("dro", "dro@dro.com", {
  //   items: [],
  //   totalPrice: 0.0,
  // });
  // user.save();
  app.listen(3000, "dro", (resp) => {
    console.log("Server Started");
  });
});
