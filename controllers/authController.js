const User = require("./../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  User.findById("5ff3415ae1031f26643137da")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        if (err) {
          return console.log(err);
        }
        res.redirect("/");
      });
    })
    .catch(console.log);
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email: "ikdhu" })
    .then((resp) => {
      console.log(resp);
      if (resp) {
        res.redirect("/signup");
      } else {
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            console.log(hashedPassword);
            const user = new User({
              email,
              password: hashedPassword,
              cart: {
                items: [],
                totalPrice: 0.0,
              },
            });
            return user.save();
          })
          .then((resp) => {
            res.redirect("/login");
          })
          .catch(console.log);
      }
    })
    .catch(console.log);
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/login");
  });
};
