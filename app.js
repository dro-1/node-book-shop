const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const MONGO_URI =
  process.env.MONGODB_URI ||
  `mongodb+srv://dro:pword1234@cluster0.ytwpa.mongodb.net/shop`;
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const connector = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const Controller404 = require("./controllers/404");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.session.user = user;
        next();
      })
      .catch(console.log);
  } else {
    next();
  }
});

app.use("/admin", adminRoutes);

app.use(shopRouter);

app.use(authRouter);

app.use(Controller404.get404Page);

connector(() => {
  User.findOne().then((user) => {
    if (!user) {
      const user = new User({
        name: "dro",
        email: "dro@dro.com",
        cart: {
          items: [],
          totalPrice: 0.0,
        },
      });
      user.save();
    }
  });
  app.listen(3000, "dro", (resp) => {
    console.log("Server Started");
  });
});
